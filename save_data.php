<?php
// save_data.php - zapisuje dane do pliku JSON
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Obsługa zapytania OPTIONS (CORS preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Ścieżka do pliku JSON
$jsonFile = 'data.json';

// Sprawdź czy plik istnieje, jeśli nie - utwórz domyślny
if (!file_exists($jsonFile)) {
    $defaultData = [
        'rules' => [
            ['title' => 'Zakaz używania cheatów', 'description' => 'Automatyczny ban za KillAurę, AutoClicker, Jesus itp.'],
            ['title' => 'Szanuj innych graczy', 'description' => 'Brak toksyczności i spamu na czacie'],
            ['title' => 'Zakaz exploitów', 'description' => 'Brak dupowania itemów i bugów serwera'],
            ['title' => 'Zakaz reklamy', 'description' => 'Promowanie innych serwerów = permaban']
        ],
        'changelog' => [
            ['version' => 'v1.0.0', 'date' => '2024-01-15', 'content' => '🎉 Oficjalne uruchomienie serwera!\n- Dodano tryby PvP, SkyWars, BedWars\n- Anti-Cheat system\n- Panel administracyjny']
        ]
    ];
    file_put_contents($jsonFile, json_encode($defaultData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

// GET - pobierz dane
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $data = json_decode(file_get_contents($jsonFile), true);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit();
}

// POST - zapisz dane
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (isset($input['rules']) || isset($input['changelog'])) {
        // Odczytaj istniejące dane
        $currentData = json_decode(file_get_contents($jsonFile), true);
        
        // Aktualizuj tylko to co przyszło
        if (isset($input['rules'])) {
            $currentData['rules'] = $input['rules'];
        }
        if (isset($input['changelog'])) {
            $currentData['changelog'] = $input['changelog'];
        }
        
        // Zapisz do pliku
        if (file_put_contents($jsonFile, json_encode($currentData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE))) {
            echo json_encode(['success' => true, 'message' => 'Zapisano pomyślnie']);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Błąd zapisu pliku']);
        }
    } else {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Brak danych do zapisu']);
    }
    exit();
}

// Inne metody - błąd
http_response_code(405);
echo json_encode(['success' => false, 'message' => 'Metoda nieobsługiwana']);
?>
