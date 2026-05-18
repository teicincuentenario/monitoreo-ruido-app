-- Crear base de datos
CREATE DATABASE IF NOT EXISTS monitoreo_ruido;
USE monitoreo_ruido;

-- Tabla de mediciones de ruido
CREATE TABLE IF NOT EXISTS mediciones (
    id INT PRIMARY KEY AUTO_INCREMENT,
    fecha DATE NOT NULL,
    grado VARCHAR(50) NOT NULL,
    salon VARCHAR(100) NOT NULL,
    decibeles DECIMAL(5,2) NOT NULL,
    jornada ENUM('Mañana', 'Tarde') NOT NULL,
    clasificacion ENUM('Bajo', 'Medio', 'Alto') NOT NULL,
    zona VARCHAR(100),
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_fecha (fecha),
    INDEX idx_salon (salon),
    INDEX idx_jornada (jornada),
    INDEX idx_clasificacion (clasificacion)
);

-- Tabla de salones
CREATE TABLE IF NOT EXISTS salones (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    zona VARCHAR(100),
    descripcion TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de grados
CREATE TABLE IF NOT EXISTS grados (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de análisis automáticos
CREATE TABLE IF NOT EXISTS analisis (
    id INT PRIMARY KEY AUTO_INCREMENT,
    fecha_analisis TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    salon_mayor_ruido VARCHAR(100),
    decibeles_mayor DECIMAL(5,2),
    salon_menor_ruido VARCHAR(100),
    decibeles_menor DECIMAL(5,2),
    promedio_general DECIMAL(5,2),
    jornada ENUM('Mañana', 'Tarde'),
    zona VARCHAR(100)
);

-- Insertar datos iniciales de salones
INSERT INTO salones (nombre, zona, descripcion) VALUES
('Patio', 'Exterior', 'Zona de descanso'),
('Sistemas', 'Tecnología', 'Sala de informática'),
('Biblioteca', 'Académica', 'Zona de estudios'),
('Secretaría', 'Administrativa', 'Oficinas administrativas'),
('Sala de Profesores', 'Administrativa', 'Sala de maestros'),
('Aula 101', 'Académica', 'Clase de primaria'),
('Aula 102', 'Académica', 'Clase de primaria'),
('Aula 201', 'Académica', 'Clase de secundaria'),
('Aula 202', 'Académica', 'Clase de secundaria'),
('Cafetería', 'Servicios', 'Zona de alimentación'),
('Laboratorio', 'Tecnología', 'Laboratorio de ciencias'),
('Auditorio', 'Eventos', 'Sala de eventos');

-- Insertar datos iniciales de grados
INSERT INTO grados (nombre) VALUES
('Preescolar'),
('1°'),
('2°'),
('3°'),
('4°'),
('5°'),
('6°'),
('7°'),
('8°'),
('9°'),
('10°'),
('11°');
