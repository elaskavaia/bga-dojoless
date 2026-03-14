<?php
define("APP_GAMEMODULE_PATH", getenv("APP_GAMEMODULE_PATH"));
spl_autoload_register(function ($class_name) {
    // stubs from bga-shardcode ~/git/bga-sharedcode/misc/
    switch ($class_name) {
        case "Table":
        case "Notify":
        case "Bga\\GameFramework\\Notify":
        case "Bga\\GameFramework\\Table":
            include APP_GAMEMODULE_PATH . "/module/table" . "/table.game.php";
            return;
        case "Deck":
            include APP_GAMEMODULE_PATH . "/module/common/deck.game.php";
            return;
    }

    $namespacePrefix = "Bga\\Games\\dojoless\\";
    $baseDirectory = __DIR__ . "/..";

    if (strpos($class_name, $namespacePrefix) === 0) {
        $relativeClass = substr($class_name, strlen($namespacePrefix));
        $filePath = $baseDirectory . "/" . str_replace("\\", "/", $relativeClass) . ".php";

        if (file_exists($filePath)) {
            require_once $filePath;
            return;
        }
    }
});
