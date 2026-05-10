package CalculaterApp.Calculater.model;

public class HistroyEntry {
    private long id;
    private String expression;
    private double result;
    private String timestamp;
    private boolean success;
    private String errorMessage;

    public HistroyEntry() {}

    public long getId() { return id; }
    public void setId(long id) { this.id = id; }

    public String getExpression() { return expression; }
    public void setExpression(String expression) { this.expression = expression; }

    public double getResult() { return result; }
    public void setResult(double result) { this.result = result; }

    public String getTimestamp() { return timestamp; }
    public void setTimestamp(String timestamp) { this.timestamp = timestamp; }

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public String getErrorMessage() { return errorMessage; }
    public void setErrorMessage(String errorMessage) { this.errorMessage = errorMessage; }
}
