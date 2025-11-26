/**
 * ============================================================================
 * CUSTOM FIELD CONTROLLER - Controlador de Campos Personalizados
 * ============================================================================
 *
 * Este módulo maneja los campos personalizados para contactos:
 * - CRUD de campos personalizados
 * - Validación de campos
 * - Gestión de opciones para selects
 *
 * FLUJOS PRINCIPALES:
 * 1. Crear campo personalizado → Usarlo en contactos
 * 2. Listar campos activos → Mostrar en formularios
 * 3. Actualizar/Eliminar campos → Mantener datos consistentes
 *
 * CASOS DE USO:
 * - "Empresa" (text)
 * - "Cargo" (select: CEO, Manager, Developer, etc.)
 * - "Fecha de nacimiento" (date)
 * - "Ingresos anuales" (number)
 * - "Intereses" (multiselect: Marketing, Ventas, Tech, etc.)
 *
 * ============================================================================
 */

import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import CustomField from '../models/CustomField';

// ============================================================================
// CRUD DE CAMPOS PERSONALIZADOS
// ============================================================================

/**
 * Obtener todos los campos personalizados
 *
 * FLUJO:
 * STEP 1: Parsear filtros opcionales (isActive)
 * STEP 2: Buscar campos en la base de datos
 * STEP 3: Ordenar por fecha de creación
 * STEP 4: Retornar lista de campos
 *
 * @route GET /api/custom-fields?isActive=true
 */
export const getCustomFields = async (req: AuthRequest, res: Response) => {
  try {
    // STEP 1: Construir filtro
    const filter: any = {};
    if (req.query.isActive !== undefined) {
      filter.isActive = req.query.isActive === 'true';
    }

    console.log('[CustomField] 📋 Fetching custom fields, filter:', filter);

    // STEP 2 y 3: Buscar y ordenar
    const fields = await CustomField.find(filter).sort({ createdAt: -1 });

    // STEP 4: Retornar campos
    res.status(200).json({
      success: true,
      count: fields.length,
      data: fields,
    });
  } catch (error: any) {
    console.error('[CustomField] ❌ Error fetching custom fields:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Obtener un campo personalizado por ID
 *
 * FLUJO:
 * STEP 1: Buscar campo por ID
 * STEP 2: Validar que existe
 * STEP 3: Retornar campo
 *
 * @route GET /api/custom-fields/:id
 */
export const getCustomField = async (req: AuthRequest, res: Response) => {
  try {
    // STEP 1 y 2: Buscar y validar
    const field = await CustomField.findById(req.params.id);

    if (!field) {
      return res.status(404).json({
        success: false,
        message: 'Custom field not found',
      });
    }

    // STEP 3: Retornar campo
    res.status(200).json({
      success: true,
      data: field,
    });
  } catch (error: any) {
    console.error('[CustomField] ❌ Error fetching custom field:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Crear un nuevo campo personalizado
 *
 * FLUJO:
 * STEP 1: Validar datos requeridos
 * STEP 2: Generar fieldKey único si no se proporciona
 * STEP 3: Validar que fieldKey no exista
 * STEP 4: Crear campo en base de datos
 * STEP 5: Retornar campo creado
 *
 * VALIDACIONES:
 * - name y nameEn requeridos
 * - type debe ser válido
 * - options requeridas para select/multiselect
 * - fieldKey único
 *
 * @route POST /api/custom-fields
 */
export const createCustomField = async (req: AuthRequest, res: Response) => {
  try {
    // STEP 1: Validar datos básicos
    const { name, nameEn, type, options, isRequired, defaultValue } = req.body;

    if (!name || !nameEn || !type) {
      return res.status(400).json({
        success: false,
        message: 'name, nameEn, and type are required',
      });
    }

    // Validar opciones para select/multiselect
    if ((type === 'select' || type === 'multiselect') && (!options || options.length === 0)) {
      return res.status(400).json({
        success: false,
        message: `options are required for ${type} fields`,
      });
    }

    // STEP 2: Generar fieldKey único
    let fieldKey = req.body.fieldKey;
    if (!fieldKey) {
      // Generar a partir del nombre en inglés
      fieldKey = nameEn
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '');
    }

    // STEP 3: Verificar que fieldKey no exista
    const existingField = await CustomField.findOne({ fieldKey });
    if (existingField) {
      return res.status(400).json({
        success: false,
        message: `Field with key "${fieldKey}" already exists`,
      });
    }

    console.log(`[CustomField] ➕ Creating new custom field: ${name} (${fieldKey})`);

    // STEP 4: Crear campo
    const field = await CustomField.create({
      name,
      nameEn,
      fieldKey,
      type,
      options: options || [],
      isRequired: isRequired || false,
      defaultValue,
      isActive: true,
    });

    // STEP 5: Retornar campo creado
    res.status(201).json({
      success: true,
      data: field,
    });
  } catch (error: any) {
    console.error('[CustomField] ❌ Error creating custom field:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Actualizar un campo personalizado
 *
 * FLUJO:
 * STEP 1: Buscar campo por ID
 * STEP 2: Validar que existe
 * STEP 3: Validar cambios (no permitir cambio de fieldKey)
 * STEP 4: Actualizar campo
 * STEP 5: Retornar campo actualizado
 *
 * RESTRICCIONES:
 * - No se puede cambiar fieldKey (causaría inconsistencias)
 * - Type puede cambiar pero con precaución
 *
 * @route PUT /api/custom-fields/:id
 */
export const updateCustomField = async (req: AuthRequest, res: Response) => {
  try {
    // STEP 1 y 2: Buscar y validar
    const field = await CustomField.findById(req.params.id);

    if (!field) {
      return res.status(404).json({
        success: false,
        message: 'Custom field not found',
      });
    }

    // STEP 3: Validar que no se intente cambiar fieldKey
    if (req.body.fieldKey && req.body.fieldKey !== field.fieldKey) {
      return res.status(400).json({
        success: false,
        message: 'Cannot change fieldKey. Create a new field instead.',
      });
    }

    console.log(`[CustomField] ✏️ Updating custom field: ${field.name}`);

    // STEP 4: Actualizar campos permitidos
    const allowedUpdates = ['name', 'nameEn', 'type', 'options', 'isRequired', 'defaultValue', 'isActive'];
    allowedUpdates.forEach(key => {
      if (req.body[key] !== undefined) {
        (field as any)[key] = req.body[key];
      }
    });

    await field.save();

    // STEP 5: Retornar campo actualizado
    res.status(200).json({
      success: true,
      data: field,
    });
  } catch (error: any) {
    console.error('[CustomField] ❌ Error updating custom field:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Eliminar un campo personalizado
 *
 * FLUJO:
 * STEP 1: Buscar campo por ID
 * STEP 2: Validar que existe
 * STEP 3: Soft delete (marcar como inactivo)
 * STEP 4: Retornar confirmación
 *
 * NOTA: Usamos soft delete para no perder datos históricos
 * Los datos en los contactos se mantienen pero el campo no aparece en nuevos formularios
 *
 * @route DELETE /api/custom-fields/:id
 */
export const deleteCustomField = async (req: AuthRequest, res: Response) => {
  try {
    // STEP 1 y 2: Buscar y validar
    const field = await CustomField.findById(req.params.id);

    if (!field) {
      return res.status(404).json({
        success: false,
        message: 'Custom field not found',
      });
    }

    console.log(`[CustomField] 🗑️ Soft deleting custom field: ${field.name}`);

    // STEP 3: Soft delete (marcar como inactivo)
    field.isActive = false;
    await field.save();

    // STEP 4: Confirmar eliminación
    res.status(200).json({
      success: true,
      message: 'Custom field marked as inactive',
      data: field,
    });
  } catch (error: any) {
    console.error('[CustomField] ❌ Error deleting custom field:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Eliminar permanentemente un campo personalizado
 *
 * FLUJO:
 * STEP 1: Buscar campo por ID
 * STEP 2: Validar que existe
 * STEP 3: Eliminar permanentemente
 * STEP 4: Retornar confirmación
 *
 * ⚠️ WARNING: Esto NO elimina los datos del campo en los contactos
 * Solo elimina la definición del campo
 *
 * @route DELETE /api/custom-fields/:id/permanent
 */
export const permanentDeleteCustomField = async (req: AuthRequest, res: Response) => {
  try {
    // STEP 1 y 2: Buscar y validar
    const field = await CustomField.findById(req.params.id);

    if (!field) {
      return res.status(404).json({
        success: false,
        message: 'Custom field not found',
      });
    }

    console.log(`[CustomField] ⚠️ PERMANENT delete of custom field: ${field.name}`);

    // STEP 3: Eliminar permanentemente
    await CustomField.findByIdAndDelete(req.params.id);

    // STEP 4: Confirmar eliminación
    res.status(200).json({
      success: true,
      message: 'Custom field permanently deleted',
      data: {},
    });
  } catch (error: any) {
    console.error('[CustomField] ❌ Error permanently deleting custom field:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================================================
// UTILIDADES
// ============================================================================

/**
 * Obtener campos activos para formularios
 *
 * FLUJO:
 * STEP 1: Buscar solo campos activos
 * STEP 2: Ordenar por isRequired (requeridos primero)
 * STEP 3: Formatear para uso en forms
 * STEP 4: Retornar campos listos para usar
 *
 * @route GET /api/custom-fields/active/form-fields
 */
export const getActiveFieldsForForms = async (req: AuthRequest, res: Response) => {
  try {
    console.log('[CustomField] 📝 Fetching active fields for forms');

    // STEP 1 y 2: Buscar campos activos y ordenar
    const fields = await CustomField.find({ isActive: true })
      .sort({ isRequired: -1, createdAt: 1 });

    // STEP 3: Formatear para forms
    const formFields = fields.map(field => ({
      id: field._id,
      name: field.name,
      nameEn: field.nameEn,
      key: field.fieldKey,
      type: field.type,
      options: field.options,
      required: field.isRequired,
      defaultValue: field.defaultValue,
    }));

    // STEP 4: Retornar campos formateados
    res.status(200).json({
      success: true,
      count: formFields.length,
      data: formFields,
    });
  } catch (error: any) {
    console.error('[CustomField] ❌ Error fetching form fields:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
