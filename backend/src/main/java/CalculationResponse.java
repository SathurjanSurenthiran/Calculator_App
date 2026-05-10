package CalculaterApp.Calculater.model;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class CalculationResponse {
    private double result;
    private String expression;
    private boolean success;
    private String errorMessage;
    private String timestamp;

    public CalculationResponse() {
        this.timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("HH:mm:ss"));
    }

    // Success factory
    public static CalculationResponse success(double result, String expression) {
        CalculationResponse r = new CalculationResponse();
        r.result = result;
        r.expression = expression;
        r.success = true;
        return r;
    }

    // Error factory
    public static CalculationResponse error(String message, String expression) {
        CalculationResponse r = new CalculationResponse();
        r.errorMessage = message;
        r.expression = expression;
        r.success = false;
        return r;
    }

    public double getResult() { return result; }
    public void setResult(double result) { this.result = result; }

    public String getExpression() { return expression; }
    public void setExpression(String expression) { this.expression = expression; }

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public String getErrorMessage() { return errorMessage; }
    public void setErrorMessage(String errorMessage) { this.errorMessage = errorMessage; }

    public String getTimestamp() { return timestamp; }
    public void setTimestamp(String timestamp) { this.timestamp = timestamp; }
}
