package CalculaterApp.Calculater.service;

import CalculaterApp.Calculater.model.CalculationRequest;
import CalculaterApp.Calculater.model.CalculationResponse;
import CalculaterApp.Calculater.model.HistroyEntry;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class CalculatorService {
    // In-memory history store (no DB needed for this demo)
    private final List<HistroyEntry> history = new ArrayList<>();
    private final AtomicLong idCounter = new AtomicLong(1);
    private static final DateTimeFormatter FORMATTER =
            DateTimeFormatter.ofPattern("HH:mm:ss");

    /**
     * Performs a calculation based on the request and stores it in history.
     */
    public CalculationResponse calculate(CalculationRequest request) {
        double a = request.getOperand1();
        double b = request.getOperand2();
        String op = request.getOperator();

        // Build human-readable expression
        String displayOp = switch (op) {
            case "*" -> "×";
            case "/" -> "÷";
            default -> op;
        };
        String expression = formatNumber(a) + " " + displayOp + " " + formatNumber(b);

        CalculationResponse response;

        try {
            double result = switch (op) {
                case "+" -> a + b;
                case "-" -> a - b;
                case "*" -> a * b;
                case "/" -> {
                    if (b == 0) throw new ArithmeticException("Division by zero");
                    yield a / b;
                }
                case "%" -> a % b;
                default -> throw new IllegalArgumentException("Unknown operator: " + op);
            };

            // Check for overflow / NaN
            if (Double.isInfinite(result) || Double.isNaN(result)) {
                throw new ArithmeticException("Result is undefined");
            }

            response = CalculationResponse.success(result, expression + " = " + formatNumber(result));
            saveHistory(expression + " = " + formatNumber(result), result, true, null);

        } catch (ArithmeticException e) {
            response = CalculationResponse.error(e.getMessage(), expression);
            saveHistory(expression, 0, false, e.getMessage());
        } catch (IllegalArgumentException e) {
            response = CalculationResponse.error("Invalid operator", expression);
            saveHistory(expression, 0, false, "Invalid operator");
        }

        return response;
    }

    /**
     * Returns all history entries, most recent first.
     */
    public List<HistroyEntry> getHistory() {
        List<HistroyEntry> reversed = new ArrayList<>(history);
        Collections.reverse(reversed);
        return reversed;
    }

    /**
     * Clears all history entries.
     */
    public void clearHistory() {
        history.clear();
    }

    // ── Private helpers ──────────────────────────────────────────────────────

    private void saveHistory(String expression, double result,
                             boolean success, String errorMessage) {
        HistroyEntry entry = new HistroyEntry();
        entry.setId(idCounter.getAndIncrement());
        entry.setExpression(expression);
        entry.setResult(result);
        entry.setSuccess(success);
        entry.setErrorMessage(errorMessage);
        entry.setTimestamp(LocalDateTime.now().format(FORMATTER));
        history.add(entry);
    }

    /**
     * Formats a number: strips unnecessary trailing zeros.
     */
    private String formatNumber(double value) {
        if (value == Math.floor(value) && !Double.isInfinite(value)) {
            return String.valueOf((long) value);
        }
        return String.valueOf(value);
    }
}
