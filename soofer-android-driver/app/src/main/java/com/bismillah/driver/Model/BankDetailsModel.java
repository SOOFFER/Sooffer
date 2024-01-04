package com.bismillah.driver.Model;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

/**
 * Created by com on 23-May-18.
 */

public class BankDetailsModel {
    @SerializedName("bankDetails")
    @Expose
    private BankDetails bankDetails;

    public BankDetails getBankDetails() {
        return bankDetails;
    }

    public void setBankDetails(BankDetails bankDetails) {
        this.bankDetails = bankDetails;
    }

    public class BankDetails {

        @SerializedName("email")
        @Expose
        private String email;
        @SerializedName("holdername")
        @Expose
        private String holdername;
        @SerializedName("acctNo")
        @Expose
        private String acctNo;
        @SerializedName("banklocation")
        @Expose
        private String banklocation;
        @SerializedName("bankname")
        @Expose
        private String bankname;
        @SerializedName("swiftCode")
        @Expose
        private String swiftCode;

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getHoldername() {
            return holdername;
        }

        public void setHoldername(String holdername) {
            this.holdername = holdername;
        }

        public String getAcctNo() {
            return acctNo;
        }

        public void setAcctNo(String acctNo) {
            this.acctNo = acctNo;
        }

        public String getBanklocation() {
            return banklocation;
        }

        public void setBanklocation(String banklocation) {
            this.banklocation = banklocation;
        }

        public String getBankname() {
            return bankname;
        }

        public void setBankname(String bankname) {
            this.bankname = bankname;
        }

        public String getSwiftCode() {
            return swiftCode;
        }

        public void setSwiftCode(String swiftCode) {
            this.swiftCode = swiftCode;
        }

    }

}
