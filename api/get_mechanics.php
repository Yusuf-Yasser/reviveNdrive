<?php
require_once 'config.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');

// Handle OPTIONS request (pre-flight request)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    header('Access-Control-Allow-Origin: http://localhost:5173');
    header('Access-Control-Allow-Methods: GET, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    // Get search filters
    $search = isset($_GET['search']) ? $_GET['search'] : '';
    $specialty = isset($_GET['specialty']) ? $_GET['specialty'] : '';
    $location = isset($_GET['location']) ? $_GET['location'] : '';
    
    // Build the query
    $sql = "
        SELECT
            m.id,
            u.fullName AS name,
            u.email,
            u.phone,
            u.avatar,
            m.specialty,
            m.location,
            u.created_at as joined
        FROM
            mechanics m
        JOIN
            users u ON m.user_id = u.id
        WHERE 1=1
    ";
    
    $filters = [];
    $bindTypes = "";
    $bindValues = [];
    
    // Add search filter
    if (!empty($search)) {
        $filters[] = "(u.fullName LIKE ? OR m.specialty LIKE ?)";
        $bindTypes .= "ss";
        $searchParam = "%$search%";
        $bindValues[] = $searchParam;
        $bindValues[] = $searchParam;
    }
    
    // Add specialty filter
    if (!empty($specialty) && $specialty !== 'All Services') {
        $filters[] = "m.specialty LIKE ?";
        $bindTypes .= "s";
        $bindValues[] = "%$specialty%";
    }
    
    // Add location filter
    if (!empty($location) && $location !== 'All Locations') {
        $filters[] = "m.location = ?";
        $bindTypes .= "s";
        $bindValues[] = $location;
    }
    
    if (!empty($filters)) {
        $sql .= " AND " . implode(" AND ", $filters);
    }
    
    $sql .= " ORDER BY u.created_at DESC";
    
    // Prepare and execute the query
    $stmt = $conn->prepare($sql);
    
    if (!empty($bindValues)) {
        // Create an array of references to bind_param
        $bindParams = array();
        $bindParams[] = &$bindTypes;
        
        for ($i = 0; $i < count($bindValues); $i++) {
            $bindParams[] = &$bindValues[$i];
        }
        
        call_user_func_array(array($stmt, 'bind_param'), $bindParams);
    }
    
    $stmt->execute();
    $result = $stmt->get_result();
    
    $mechanics = [];
    
    while ($row = $result->fetch_assoc()) {
        // Get average rating and reviews count
        $ratingQuery = "SELECT AVG(rating) as avg_rating, COUNT(*) as rating_count FROM feedback WHERE mechanic_id = ?";
        $ratingStmt = $conn->prepare($ratingQuery);
        $ratingStmt->bind_param("i", $row['id']);
        $ratingStmt->execute();
        $ratingResult = $ratingStmt->get_result();
        $ratingData = $ratingResult->fetch_assoc();
        $ratingStmt->close();
        
        $avgRating = $ratingData['avg_rating'] ? round((float)$ratingData['avg_rating'], 1) : 0;
        $reviewCount = (int)$ratingData['rating_count'];
        
        // Calculate experience (years since joining)
        $joinDate = new DateTime($row['joined']);
        $now = new DateTime();
        $experience = $joinDate->diff($now)->y;
        if ($experience < 1) $experience = 1; // Minimum 1 year
        
        // Get mechanic status
        $statusQuery = "SELECT status FROM mechanic_status WHERE mechanic_id = ?";
        $statusStmt = $conn->prepare($statusQuery);
        $availability = 'Available';
        if ($statusStmt) {
            $statusStmt->bind_param("i", $row['id']);
            if ($statusStmt->execute()) {
                $statusResult = $statusStmt->get_result();
                if ($statusRow = $statusResult->fetch_assoc()) {
                    $availability = $statusRow['status'];
                }
            }
            $statusStmt->close();
        }
        
        // Map availability to more user-friendly format
        switch ($availability) {
            case 'Available':
                $availability = 'Available Today';
                break;
            case 'Busy':
                $availability = 'Next Day Available';
                break;
            case 'On Leave':
                $availability = 'Currently Unavailable';
                break;
            default:
                $availability = 'Available Today';
        }
        
        $mechanics[] = [
            'id' => $row['id'],
            'name' => $row['name'],
            'email' => $row['email'],
            'phone' => $row['phone'],
            'specialization' => $row['specialty'] ?: 'General Repairs & Maintenance',
            'location' => $row['location'] ?: 'Location not specified',
            'image' => $row['avatar'] ?: 'https://images.pexels.com/photos/3807386/pexels-photo-3807386.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
            'rating' => $avgRating > 0 ? $avgRating : 4.5, // Default rating if no reviews
            'reviews' => $reviewCount,
            'experience' => $experience . '+ years',
            'availability' => $availability,            'hourlyRate' => 85, // Default hourly rate - could be added to database later
            'certifications' => getCertificationsForSpecialty($row['specialty']),
            'services' => getServicesForSpecialty($row['specialty']),
            'bookingLink' => '/mechanic-booking'
        ];
    }
    
    $stmt->close();
    
    // Return the mechanics
    http_response_code(200);
    echo json_encode([
        'status' => 'success',
        'count' => count($mechanics),
        'mechanics' => $mechanics
    ]);
    
} else {
    http_response_code(405); // Method Not Allowed
    echo json_encode(['status' => 'error', 'message' => 'Only GET method is accepted.']);
}

// Helper function to get certifications based on specialty
function getCertificationsForSpecialty($specialty) {
    $certifications = [
        'Engine Repair' => ['ASE Engine Performance Specialist', 'Engine Diagnostics Certified'],
        'Transmission Services' => ['Transmission Specialist', 'Automatic Transmission Certified'],
        'Brake Systems' => ['Brake Specialist', 'Safety Systems Certified'],
        'Suspension and Steering' => ['Suspension Specialist', 'Alignment Certified'],
        'Electrical Systems' => ['Electrical Systems Specialist', 'Auto Electronics Certified'],
        'Air Conditioning (AC) Repair' => ['HVAC Specialist', 'Refrigeration Certified'],
        'Tire Services' => ['Tire Specialist', 'Wheel Alignment Certified'],
        'Exhaust Systems' => ['Exhaust Specialist', 'Emissions Certified'],
        'Diagnostics' => ['Master Diagnostician', 'Computer Systems Certified'],
        'General Maintenance' => ['ASE Master Technician', 'General Repair Certified']
    ];
    
    return $certifications[$specialty] ?? ['General Repair Certified', 'ASE Certified'];
}

// Helper function to get services based on specialty
function getServicesForSpecialty($specialty) {
    $services = [
        'Engine Repair' => ['Engine Diagnostics', 'Engine Rebuild', 'Oil Change', 'Tune-Up'],
        'Transmission Services' => ['Transmission Repair', 'Fluid Change', 'Clutch Repair', 'Transmission Rebuild'],
        'Brake Systems' => ['Brake Pad Replacement', 'Brake Fluid Change', 'Rotor Replacement', 'Brake Inspection'],
        'Suspension and Steering' => ['Shock Replacement', 'Strut Repair', 'Steering Alignment', 'Ball Joint Replacement'],
        'Electrical Systems' => ['Battery Service', 'Alternator Repair', 'Starter Repair', 'Wiring Repair'],
        'Air Conditioning (AC) Repair' => ['AC Repair', 'Refrigerant Recharge', 'Compressor Repair', 'Climate Control'],
        'Tire Services' => ['Tire Installation', 'Tire Rotation', 'Wheel Balancing', 'Puncture Repair'],
        'Exhaust Systems' => ['Muffler Repair', 'Catalytic Converter', 'Exhaust Pipe Repair', 'Emissions Testing'],
        'Diagnostics' => ['Computer Diagnostics', 'Engine Diagnostics', 'Electrical Testing', 'System Analysis'],
        'General Maintenance' => ['Oil Change', 'Brake Service', 'Tire Rotation', 'General Inspection']
    ];
    
    return $services[$specialty] ?? ['General Repairs', 'Maintenance', 'Diagnostics', 'Oil Change'];
}

$conn->close();
?>
