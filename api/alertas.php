<?php
header('Content-Type: application/json');
require_once '../config/database.php';

try {
    $alertas = array();
    
    // Alerta 1: Salón con mayor ruido
    $result = $conn->query("SELECT salon, AVG(decibeles) as promedio, MAX(jornada) as jornada FROM mediciones GROUP BY salon ORDER BY promedio DESC LIMIT 1");
    $row = $result->fetch_assoc();
    if ($row && $row['promedio'] > 70) {
        $alertas[] = array(
            'tipo' => 'danger',
            'titulo' => '⚠️ Alerta de Contaminación Acústica',
            'mensaje' => 'El salón "' . $row['salon'] . '" presenta el mayor ruido con ' . round($row['promedio'], 2) . ' dB en jornada ' . $row['jornada'] . '. Recomendaciones: Implementar paneles acústicos, establecer horarios de silencio.',
            'fecha' => date('Y-m-d H:i')
        );
    }
    
    // Alerta 2: Salones con ruido medio
    $result = $conn->query("SELECT COUNT(DISTINCT salon) as count FROM mediciones WHERE decibeles BETWEEN 40 AND 70 LIMIT 5");
    $row = $result->fetch_assoc();
    if ($row['count'] > 0) {
        $alertas[] = array(
            'tipo' => 'warning',
            'titulo' => '📊 Ruido Aceptable',
            'mensaje' => 'Se han registrado ' . $row['count'] . ' salones con niveles de ruido aceptables (40-70 dB). Continuar monitoreando.',
            'fecha' => date('Y-m-d H:i')
        );
    }
    
    // Alerta 3: Salones sin contaminación
    $result = $conn->query("SELECT COUNT(DISTINCT salon) as count FROM mediciones WHERE decibeles < 40");
    $row = $result->fetch_assoc();
    if ($row['count'] > 0) {
        $alertas[] = array(
            'tipo' => 'success',
            'titulo' => '✓ Zonas Libres de Contaminación',
            'mensaje' => $row['count'] . ' salones mantienen niveles de ruido bajo (< 40 dB). Excelente ambiente para concentración.',
            'fecha' => date('Y-m-d H:i')
        );
    }
    
    echo json_encode(array(
        'success' => true,
        'alertas' => $alertas
    ));
    
} catch (Exception $e) {
    echo json_encode(array('success' => false, 'error' => $e->getMessage()));
}

$conn->close();
?>