// src/controllers/empleado.controller.js
import { QueryTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

class EmpleadoController {
    // Obtener todos los empleados
    static async getAllEmpleados(req, res) {
        try {
            const empleados = await sequelize.query('CALL GetAllEmpleados()', { type: QueryTypes.RAW });
            res.json(empleados[0]);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener empleados', error });
        }
    }

    // Obtener un empleado por ID
    static async getEmpleadoById(req, res) {
        const { idEmpleado } = req.params;
        try {
            const result = await sequelize.query('CALL GetEmpleadoById(:idEmpleado)', {
                replacements: { idEmpleado },
                type: QueryTypes.RAW
            });
            const empleado = result[0][0];
            if (empleado) {
                res.json(empleado);
            } else {
                res.status(404).json({ message: 'Empleado no encontrado' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener el empleado', error });
        }
    }

    // Crear un nuevo empleado
    static async postEmpleado(req, res) {
        const { fechaContratacionEmpleado, puestoEmpleado, docum_entoFK } = req.body;
        try {
            await sequelize.query('CALL InsertarEmpleado(:fechaContratacionEmpleado, :puestoEmpleado, :docum_entoFK)', {
                replacements: { fechaContratacionEmpleado, puestoEmpleado, docum_entoFK },
                type: QueryTypes.RAW
            });
            res.status(201).json({ message: 'Empleado creado exitosamente' });
        } catch (error) {
            console.error('Error al crear el empleado:', error);
            res.status(500).json({ message: 'Error al crear el empleado', error });
        }
    }

    // Actualizar un empleado
    static async putEmpleado(req, res) {
        const idEmpleado = req.params.idEmpleado;
        const { fechaContratacionEmpleado, puestoEmpleado, docum_entoFK } = req.body;
        try {
            await sequelize.query('CALL ActualizarEmpleado(:idEmpleado, :fechaContratacionEmpleado, :puestoEmpleado, :docum_entoFK)', {
                replacements: { idEmpleado, fechaContratacionEmpleado, puestoEmpleado, docum_entoFK },
                type: QueryTypes.RAW
            });
            res.status(200).json({ message: 'Empleado actualizado correctamente' });
        } catch (error) {
            res.status(500).json({ message: 'Error al actualizar el empleado: ' + error.message });
        }
    }

    // Eliminar un empleado
    static async deleteEmpleado(req, res) {
        const idEmpleado = req.params.idEmpleado;
        try {
            await sequelize.query('CALL EliminarEmpleado(:idEmpleado)', {
                replacements: { idEmpleado },
                type: QueryTypes.RAW
            });
            res.status(200).json({ message: 'Empleado eliminado correctamente' });
        } catch (error) {
            res.status(500).json({ message: 'Error al eliminar el empleado: ' + error.message });
        }
    }
}

export default EmpleadoController;
