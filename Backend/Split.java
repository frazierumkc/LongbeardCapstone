

import java.util.Vector;



//Holds splittingHistory and vector of splitMembers entities


public class Split {

    //Split History fields 
    private int splitID;
    private int expenseID;
    private String splitDate;
    private String splitTime;

    //This field repersents who initated the split
    private int splitInitiator;

    //True - approved | False - declined | Null - pending
    //Boolean - provides tri-state condiation
    private Boolean approvalStatus;

    //Container holding all members of the split
    Vector<SplitMember> members = new Vector<>();

    //Split Members 

    //Defualt Constructor
    public Split() {
    }


    //Parmatered contructor
    public Split(Boolean approvalStatus, int expenseID, String splitDate, int splitID, int splitInitiator, String splitTime) {
        this.approvalStatus = approvalStatus;
        this.expenseID = expenseID;
        this.splitDate = splitDate;
        this.splitID = splitID;
        this.splitInitiator = splitInitiator;
        this.splitTime = splitTime;
    }

    
    //Getters and Setters

    public int getSplitID() {
        return splitID;
    }

    public void setSplitID(int splitID) {
        this.splitID = splitID;
    }

    public int getExpenseID() {
        return expenseID;
    }

    public void setExpenseID(int expenseID) {
        this.expenseID = expenseID;
    }

    public String getSplitDate() {
        return splitDate;
    }

    public void setSplitDate(String splitDate) {
        this.splitDate = splitDate;
    }

    public String getSplitTime() {
        return splitTime;
    }

    public void setSplitTime(String splitTime) {
        this.splitTime = splitTime;
    }

    public int getSplitInitiator() {
        return splitInitiator;
    }

    public void setSplitInitiator(int splitInitiator) {
        this.splitInitiator = splitInitiator;
    }

    public Boolean getApprovalStatus() {
        return approvalStatus;
    }

    public void setApprovalStatus(Boolean approvalStatus) {
        this.approvalStatus = approvalStatus;
    }



    //SplitMember Vector Methods
    public Vector<SplitMember> getMembers() {
        return members;
    }

    public void setMembers(Vector<SplitMember> members) {
        this.members = members;
    }

    public void addMember(SplitMember member) {
        this.members.add(member);
    }

    public boolean removeMember(SplitMember member) {
        return this.members.remove(member);
    }

    //using account id to find Split Member, return member
    public SplitMember findMember(int accountID) {
        for (int i = 0; i < members.size(); i++) {
            if(members.get(i).getAccountID() == accountID) {
                return members.get(i);
            }
        }
        return null;
    }


    

   


    //Specialized Methods (Update Needed Object Functions)




}
