package com.soofer.driver.Model;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

import java.util.List;

/**
 * Created by com on 22-May-18.
 */

public class AddBankModel {

    @SerializedName("success")
    @Expose
    private Boolean success;
    @SerializedName("message")
    @Expose
    private String message;
    @SerializedName("data")
    @Expose
    private Data data;

    public Boolean getSuccess() {
        return success;
    }

    public void setSuccess(Boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Data getData() {
        return data;
    }

    public void setData(Data data) {
        this.data = data;
    }



    public class BankAccount {

        @SerializedName("ifsc")
        @Expose
        private String ifsc;
        @SerializedName("bank_name")
        @Expose
        private String bankName;
        @SerializedName("name")
        @Expose
        private String name;
        @SerializedName("notes")
        @Expose
        private List<Object> notes = null;
        @SerializedName("account_number")
        @Expose
        private String accountNumber;

        public String getIfsc() {
            return ifsc;
        }

        public void setIfsc(String ifsc) {
            this.ifsc = ifsc;
        }

        public String getBankName() {
            return bankName;
        }

        public void setBankName(String bankName) {
            this.bankName = bankName;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public List<Object> getNotes() {
            return notes;
        }

        public void setNotes(List<Object> notes) {
            this.notes = notes;
        }

        public String getAccountNumber() {
            return accountNumber;
        }

        public void setAccountNumber(String accountNumber) {
            this.accountNumber = accountNumber;
        }

    }
    public class Data {

        @SerializedName("id")
        @Expose
        private String id;
        @SerializedName("entity")
        @Expose
        private String entity;
        @SerializedName("contact_id")
        @Expose
        private String contactId;
        @SerializedName("account_type")
        @Expose
        private String accountType;
        @SerializedName("bank_account")
        @Expose
        private BankAccount bankAccount;
        @SerializedName("batch_id")
        @Expose
        private Object batchId;
        @SerializedName("active")
        @Expose
        private Boolean active;
        @SerializedName("created_at")
        @Expose
        private String createdAt;

        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public String getEntity() {
            return entity;
        }

        public void setEntity(String entity) {
            this.entity = entity;
        }

        public String getContactId() {
            return contactId;
        }

        public void setContactId(String contactId) {
            this.contactId = contactId;
        }

        public String getAccountType() {
            return accountType;
        }

        public void setAccountType(String accountType) {
            this.accountType = accountType;
        }

        public BankAccount getBankAccount() {
            return bankAccount;
        }

        public void setBankAccount(BankAccount bankAccount) {
            this.bankAccount = bankAccount;
        }

        public Object getBatchId() {
            return batchId;
        }

        public void setBatchId(Object batchId) {
            this.batchId = batchId;
        }

        public Boolean getActive() {
            return active;
        }

        public void setActive(Boolean active) {
            this.active = active;
        }

        public String getCreatedAt() {
            return createdAt;
        }

        public void setCreatedAt(String createdAt) {
            this.createdAt = createdAt;
        }

    }


}
