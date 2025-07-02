package com.soofer.driver.Model;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

import java.util.List;

public class AddVehicleDocModel {


    @SerializedName("success")
    @Expose
    private Boolean success;
    @SerializedName("message")
    @Expose
    private String message;
    @SerializedName("drivertaxis")
    @Expose
    private Drivertaxis drivertaxis;
    @SerializedName("fileurl")
    @Expose
    private String fileurl;
    @SerializedName("file")
    @Expose
    private File file;

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

    public Drivertaxis getDrivertaxis() {
        return drivertaxis;
    }

    public void setDrivertaxis(Drivertaxis drivertaxis) {
        this.drivertaxis = drivertaxis;
    }

    public String getFileurl() {
        return fileurl;
    }

    public void setFileurl(String fileurl) {
        this.fileurl = fileurl;
    }

    public File getFile() {
        return file;
    }

    public void setFile(File file) {
        this.file = file;
    }
    public class Drivertaxis {

        @SerializedName("color")
        @Expose
        private String color;
        @SerializedName("driver")
        @Expose
        private String driver;
        @SerializedName("cpy")
        @Expose
        private String cpy;
        @SerializedName("licence")
        @Expose
        private String licence;
        @SerializedName("year")
        @Expose
        private String year;
        @SerializedName("model")
        @Expose
        private String model;
        @SerializedName("makename")
        @Expose
        private String makename;
        @SerializedName("_id")
        @Expose
        private String id;
        @SerializedName("taxistatus")
        @Expose
        private String taxistatus;
        @SerializedName("permitexpdate")
        @Expose
        private String permitexpdate;
        @SerializedName("registrationexpdate")
        @Expose
        private String registrationexpdate;
        @SerializedName("registration")
        @Expose
        private String registration;
        @SerializedName("permit")
        @Expose
        private String permit;
        @SerializedName("insurance")
        @Expose
        private String insurance;
        @SerializedName("type")
        @Expose
        private List<Type> type = null;
        @SerializedName("handicap")
        @Expose
        private String handicap;

        public String getColor() {
            return color;
        }

        public void setColor(String color) {
            this.color = color;
        }

        public String getDriver() {
            return driver;
        }

        public void setDriver(String driver) {
            this.driver = driver;
        }

        public String getCpy() {
            return cpy;
        }

        public void setCpy(String cpy) {
            this.cpy = cpy;
        }

        public String getLicence() {
            return licence;
        }

        public void setLicence(String licence) {
            this.licence = licence;
        }

        public String getYear() {
            return year;
        }

        public void setYear(String year) {
            this.year = year;
        }

        public String getModel() {
            return model;
        }

        public void setModel(String model) {
            this.model = model;
        }

        public String getMakename() {
            return makename;
        }

        public void setMakename(String makename) {
            this.makename = makename;
        }

        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public String getTaxistatus() {
            return taxistatus;
        }

        public void setTaxistatus(String taxistatus) {
            this.taxistatus = taxistatus;
        }

        public String getPermitexpdate() {
            return permitexpdate;
        }

        public void setPermitexpdate(String permitexpdate) {
            this.permitexpdate = permitexpdate;
        }

        public String getRegistrationexpdate() {
            return registrationexpdate;
        }

        public void setRegistrationexpdate(String registrationexpdate) {
            this.registrationexpdate = registrationexpdate;
        }

        public String getRegistration() {
            return registration;
        }

        public void setRegistration(String registration) {
            this.registration = registration;
        }

        public String getPermit() {
            return permit;
        }

        public void setPermit(String permit) {
            this.permit = permit;
        }

        public String getInsurance() {
            return insurance;
        }

        public void setInsurance(String insurance) {
            this.insurance = insurance;
        }

        public List<Type> getType() {
            return type;
        }

        public void setType(List<Type> type) {
            this.type = type;
        }

        public String getHandicap() {
            return handicap;
        }

        public void setHandicap(String handicap) {
            this.handicap = handicap;
        }

    }
    public class File {

        @SerializedName("fieldname")
        @Expose
        private String fieldname;
        @SerializedName("originalname")
        @Expose
        private String originalname;
        @SerializedName("encoding")
        @Expose
        private String encoding;
        @SerializedName("mimetype")
        @Expose
        private String mimetype;
        @SerializedName("destination")
        @Expose
        private String destination;
        @SerializedName("filename")
        @Expose
        private String filename;
        @SerializedName("path")
        @Expose
        private String path;
        @SerializedName("size")
        @Expose
        private Integer size;

        public String getFieldname() {
            return fieldname;
        }

        public void setFieldname(String fieldname) {
            this.fieldname = fieldname;
        }

        public String getOriginalname() {
            return originalname;
        }

        public void setOriginalname(String originalname) {
            this.originalname = originalname;
        }

        public String getEncoding() {
            return encoding;
        }

        public void setEncoding(String encoding) {
            this.encoding = encoding;
        }

        public String getMimetype() {
            return mimetype;
        }

        public void setMimetype(String mimetype) {
            this.mimetype = mimetype;
        }

        public String getDestination() {
            return destination;
        }

        public void setDestination(String destination) {
            this.destination = destination;
        }

        public String getFilename() {
            return filename;
        }

        public void setFilename(String filename) {
            this.filename = filename;
        }

        public String getPath() {
            return path;
        }

        public void setPath(String path) {
            this.path = path;
        }

        public Integer getSize() {
            return size;
        }

        public void setSize(Integer size) {
            this.size = size;
        }

    }
    public class Type {

        @SerializedName("_id")
        @Expose
        private String id;
        @SerializedName("luxury")
        @Expose
        private String luxury;
        @SerializedName("normal")
        @Expose
        private String normal;
        @SerializedName("basic")
        @Expose
        private String basic;

        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public String getLuxury() {
            return luxury;
        }

        public void setLuxury(String luxury) {
            this.luxury = luxury;
        }

        public String getNormal() {
            return normal;
        }

        public void setNormal(String normal) {
            this.normal = normal;
        }

        public String getBasic() {
            return basic;
        }

        public void setBasic(String basic) {
            this.basic = basic;
        }

    }

}
