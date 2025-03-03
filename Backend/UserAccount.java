import java.util.Vector;

//User Account
//This Class Object holds UserAccount, contracts, and Settings Entity
//Update Required: add methods 

public class UserAccount {
    private String firstName;
    private String lastName;
    private String password;
    private String email;
    private double accountBalance;
    private String accountID;

    //Setting Entity
    private String lightDarkSetting;

    //holds account IDs as a refernce to contacts
    private Vector<Integer> contacts = new Vector<>();

    

    

    //default constructor
    public UserAccount() {}

    //parameterized constructor
    public UserAccount(String firstName, String lastName, String password, String email, double accountBalance, String accountID) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.password = password;
        this.email = email;
        this.accountBalance = accountBalance;
        this.accountID = accountID;
    }

    //getters and setters
    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public double getAccountBalance() {
        return accountBalance;
    }

    public void setAccountBalance(double accountBalance) {
        this.accountBalance = accountBalance;
    }

    public String getAccountID() {
        return accountID;
    }

    public void setAccountID(String accountID) {
        this.accountID = accountID;
    }

    public String getLightDarkSetting() {
        return lightDarkSetting;
    }

    public void setLightDarkSetting(String lightDarkSetting){
        this.lightDarkSetting = lightDarkSetting;
    }


    //Contacts Vector Methods:
    
    public Vector<Integer> getContacts() {
        return contacts;
    }

    public void setContacts(Vector<Integer> contacts) {
        this.contacts = contacts;
    }
    
 
    public void addContact(int id) {
        this.contacts.add(id);
    }


    public boolean removeContact(Integer id) {
        return this.contacts.remove(id);
    }

    


    //Output Contact ids
    public void printContacts() {
        if (contacts.isEmpty()) {
            System.out.println("No contacts available.");
            return;
        }
        System.out.print("Contact IDs: ");
        for (Integer id : contacts) {
            System.out.print(id + " ");
        }
        System.out.println();
    }

    @Override
    public String toString() {
        return "UserAccount{" +
                "firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", email='" + email + '\'' +
                ", accountBalance=" + accountBalance +
                ", accountID='" + accountID + '\'' +
                '}';
    }


    // Specailized Funcitons(Update Needed Object Functions)

    //Function passwordCheck:
    //Function emailCheck:
    //Function depositFunds:
    //Function withdrawFunds:
}

