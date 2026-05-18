<?php
header('Content-Type: application/json');
require_once '../config/database.php';

try {
    // Obtener máximo ruido
    $result_max = $conn->query("SELECT MAX(decibeles) as max_ruido, salon as salon_max_ruido FROM mediciones GROUP BY salon ORDER BY max_ruido DESC LIMIT 1");
    $max_data = $result_max->fetch_assoc();
    
    // Obtener mínimo ruido
    $result_min = $conn->query("SELECT MIN(decibeles) as min_ruido, salon as salon_min_ruido FROM mediciones GROUP BY salon ORDER BY min_ruido ASC LIMIT 1");
    $min_data = $result_min->fetch_assoc();
    
    // Obtener promedio general
    $result_avg = $conn->query("SELECT AVG(decibeles) as promedio_ruido FROM mediciones");
    $avg_data = $result_avg->fetch_assoc();
    
    // Contar salones en alerta (>70 dB)
    $result_alert = $conn->query("SELECT COUNT(DISTINCT salon) as salones_alerta FROM mediciones WHERE decibeles > 70");
    $alert_data = $result_alert->fetch_assoc();
    
    $response = array(
        'success' => true,
        'max_ruido' => $max_data['max_ruido'] ?? 0,
        'salon_max_ruido' => $max_data['salon_max_ruido'] ?? 'N/A',
        'min_ruido' => $min_data['min_ruido'] ?? 0,
        'salon_min_ruido' => $min_data['salon_min_ruido'] ?? 'N/A',
        'promedio_ruido' => $avg_data['promedio_ruido'] ?? 0,
        'salones_alerta' => $alert_data['salones_alerta'] ?? 0
    );
    
    echo json_encode($response);
    
} catch (Exception $e) {
    echo json_encode(array('success' => false, 'error' => $e->getMessage()));
}

$conn->close();
?>