/**
 * ============================================================================
 * CUSTOM FIELD ROUTES - Rutas de Campos Personalizados
 * ============================================================================
 *
 * Define todos los endpoints para gestionar campos personalizados:
 * - CRUD completo de campos
 * - Obtener campos activos para formularios
 * - Soft delete y hard delete
 *
 * Todas las rutas requieren autenticación
 *
 * ============================================================================
 */

import express from 'express';
import { auth } from '../middleware/auth';
import {
  getCustomFields,
  getCustomField,
  createCustomField,
  updateCustomField,
  deleteCustomField,
  permanentDeleteCustomField,
  getActiveFieldsForForms,
} from '../controllers/customFieldController';

const router = express.Router();

// ============================================================================
// TODAS LAS RUTAS REQUIEREN AUTENTICACIÓN
// ============================================================================
router.use(auth);

// ============================================================================
// ENDPOINTS DE GESTIÓN
// ============================================================================

/**
 * GET /api/custom-fields
 * Obtener todos los campos personalizados
 *
 * Query params:
 * - isActive: true/false (opcional)
 *
 * Response:
 * {
 *   "success": true,
 *   "count": 5,
 *   "data": [...]
 * }
 */
router.get('/', getCustomFields);

/**
 * GET /api/custom-fields/active/form-fields
 * Obtener campos activos formateados para formularios
 *
 * Response:
 * {
 *   "success": true,
 *   "count": 3,
 *   "data": [
 *     {
 *       "id": "...",
 *       "name": "Empresa",
 *       "nameEn": "Company",
 *       "key": "company",
 *       "type": "text",
 *       "required": false
 *     }
 *   ]
 * }
 */
router.get('/active/form-fields', getActiveFieldsForForms);

/**
 * GET /api/custom-fields/:id
 * Obtener un campo específico
 */
router.get('/:id', getCustomField);

/**
 * POST /api/custom-fields
 * Crear un nuevo campo personalizado
 *
 * Body:
 * {
 *   "name": "Empresa",
 *   "nameEn": "Company",
 *   "type": "text",
 *   "isRequired": false
 * }
 *
 * Tipos soportados:
 * - text: Campo de texto libre
 * - number: Número
 * - date: Fecha
 * - select: Selección única (requiere options)
 * - multiselect: Selección múltiple (requiere options)
 */
router.post('/', createCustomField);

/**
 * PUT /api/custom-fields/:id
 * Actualizar un campo personalizado
 *
 * Body: (todos opcionales excepto los que se quieran actualizar)
 * {
 *   "name": "Nuevo nombre",
 *   "isActive": false,
 *   "options": ["Opción 1", "Opción 2"]
 * }
 */
router.put('/:id', updateCustomField);

/**
 * DELETE /api/custom-fields/:id
 * Soft delete - marcar campo como inactivo
 *
 * El campo deja de aparecer en formularios pero los datos históricos se mantienen
 */
router.delete('/:id', deleteCustomField);

/**
 * DELETE /api/custom-fields/:id/permanent
 * Hard delete - eliminar permanentemente la definición del campo
 *
 * ⚠️ WARNING: Esto NO elimina los datos en los contactos
 * Solo elimina la definición del campo
 */
router.delete('/:id/permanent', permanentDeleteCustomField);

export default router;
