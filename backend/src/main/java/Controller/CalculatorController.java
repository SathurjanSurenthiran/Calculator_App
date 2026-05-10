package CalculaterApp.Calculater.controller;

import CalculaterApp.Calculater.model.CalculationRequest;
import CalculaterApp.Calculater.model.CalculationResponse;
import CalculaterApp.Calculater.model.HistroyEntry;
import CalculaterApp.Calculater.service.CalculatorService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * REST controller exposing calculator and history endpoints.
 *
 * Base URL: /api/calculator
 */
@RestController
@RequestMapping("/api/calculator")

public class CalculatorController {
    private final CalculatorService calculatorService;

    public CalculatorController(CalculatorService calculatorService) {
        this.calculatorService = calculatorService;
    }

    /**
     * POST /api/calculator/calculate
     * Body: { operand1, operand2, operator }
     * Returns: CalculationResponse JSON
     */
    @PostMapping("/calculate")
    public ResponseEntity<CalculationResponse> calculate(
            @RequestBody CalculationRequest request) {

        // Basic input validation
        if (request.getOperator() == null || request.getOperator().isBlank()) {
            return ResponseEntity.badRequest()
                    .body(CalculationResponse.error("Operator is required", ""));
        }

        CalculationResponse response = calculatorService.calculate(request);
        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/calculator/history
     * Returns all history entries (most recent first).
     */
    @GetMapping("/history")
    public ResponseEntity<List<HistroyEntry>> getHistory() {
        return ResponseEntity.ok(calculatorService.getHistory());
    }

    /**
     * DELETE /api/calculator/history
     * Clears all history entries.
     */
    @DeleteMapping("/history")
    public ResponseEntity<Map<String, String>> clearHistory() {
        calculatorService.clearHistory();
        return ResponseEntity.ok(Map.of("message", "History cleared successfully"));
    }

    /**
     * GET /api/calculator/health
     * Simple health-check endpoint.
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of("status", "UP", "service", "Calculator API"));
    }
}
