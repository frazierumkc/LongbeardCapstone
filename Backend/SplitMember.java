



public class SplitMember {
    
    private int splitID;
    private int accountID;
    private double splitAmount; //FixMe: Split amount still needs to be clarified
    
    //True - approved | False - declined | Null - pending
    //Boolean - provides tri-state condiation
    private Boolean memberApprovalStatus; 




    //Defualt Constructor
    public SplitMember() {}

    //Parametered Constructor
    public SplitMember(int accountID, Boolean memberApprovalStatus, double splitAmount, int splitID) {
        this.accountID = accountID;
        this.memberApprovalStatus = memberApprovalStatus;
        this.splitAmount = splitAmount;
        this.splitID = splitID;
    }


    //Getters and Setters
    public int getSplitID() {
        return splitID;
    }

    public void setSplitID(int splitID) {
        this.splitID = splitID;
    }

    public int getAccountID() {
        return accountID;
    }

    public void setAccountID(int accountID) {
        this.accountID = accountID;
    }

    public double getSplitAmount() {
        return splitAmount;
    }

    public void setSplitAmount(double splitAmount) {
        this.splitAmount = splitAmount;
    }

    public Boolean getMemberApprovalStatus() {
        return memberApprovalStatus;
    }

    public void setMemberApprovalStatus(Boolean memberApprovalStatus) {
        this.memberApprovalStatus = memberApprovalStatus;
    }

    //Specialized Mehtods (Update Needed Object Functions)



}
