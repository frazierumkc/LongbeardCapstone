

//Expense - this class object reperesnts the entity expense. 
//Update Required: add future methods


public class Expense {
    
    private int expenseID;
    private int accountID;
    private double expenseAmount;
    private String expenseDate;
    private String expenseTime;
    private String expenseTitle;
    private String expenseDescription;

    
    //Default Constructor
    public Expense() {}

    //Parameterized Constructor
    public Expense(int expenseID, int accountID, double expenseAmount, String expenseDate, String expenseTime,
            String expenseTitle, String expenseDescription) {
        this.expenseID = expenseID;
        this.accountID = accountID;
        this.expenseAmount = expenseAmount;
        this.expenseDate = expenseDate;
        this.expenseTime = expenseTime;
        this.expenseTitle = expenseTitle;
        this.expenseDescription = expenseDescription;
    }


    //Getters and Setters
    public int getExpenseID() {
        return expenseID;
    }
    public void setExpenseID(int expenseID) {
        this.expenseID = expenseID;
    }
    public int getAccountID() {
        return accountID;
    }
    public void setAccountID(int accountID) {
        this.accountID = accountID;
    }
    public double getExpenseAmount() {
        return expenseAmount;
    }
    public void setExpenseAmount(double expenseAmount) {
        this.expenseAmount = expenseAmount;
    }
    public String getExpenseDate() {
        return expenseDate;
    }
    public void setExpenseDate(String expenseDate) {
        this.expenseDate = expenseDate;
    }
    public String getExpenseTime() {
        return expenseTime;
    }
    public void setExpenseTime(String expenseTime) {
        this.expenseTime = expenseTime;
    }
    public String getExpenseTitle() {
        return expenseTitle;
    }
    public void setExpenseTitle(String expenseTitle) {
        this.expenseTitle = expenseTitle;
    }
    public String getExpenseDescription() {
        return expenseDescription;
    }
    public void setExpenseDescription(String expenseDescription) {
        this.expenseDescription = expenseDescription;
    }

    //Specailized Methods (Update Needed Object Functions)
    
}
