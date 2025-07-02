package com.soofer.driver.Model;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

import java.util.List;

public class CarModel {

    @SerializedName("success")
    @Expose
    private Boolean success;
    @SerializedName("carmake")
    @Expose
    private List<Carmake> carmake = null;
    @SerializedName("years")
    @Expose
    private List<Year> years = null;
    @SerializedName("color")
    @Expose
    private List<Color> color = null;

    public Boolean getSuccess() {
        return success;
    }

    public void setSuccess(Boolean success) {
        this.success = success;
    }

    public List<Carmake> getCarmake() {
        return carmake;
    }

    public void setCarmake(List<Carmake> carmake) {
        this.carmake = carmake;
    }

    public List<Year> getYears() {
        return years;
    }

    public void setYears(List<Year> years) {
        this.years = years;
    }

    public List<Color> getColor() {
        return color;
    }

    public void setColor(List<Color> color) {
        this.color = color;
    }

    public class Carmake {

        @SerializedName("datas")
        @Expose
        private List<Data> datas = null;

        public List<Data> getDatas() {
            return datas;
        }

        public void setDatas(List<Data> datas) {
            this.datas = datas;
        }

    }
    public class Data {

        @SerializedName("makeid")
        @Expose
        private Integer makeid;
        @SerializedName("make")
        @Expose
        private String make;
        @SerializedName("model")
        @Expose
        private List<String> model = null;

        public Integer getMakeid() {
            return makeid;
        }

        public void setMakeid(Integer makeid) {
            this.makeid = makeid;
        }

        public String getMake() {
            return make;
        }

        public void setMake(String make) {
            this.make = make;
        }

        public List<String> getModel() {
            return model;
        }

        public void setModel(List<String> model) {
            this.model = model;
        }

    }
    public class Data_ {

        @SerializedName("id")
        @Expose
        private String id;
        @SerializedName("name")
        @Expose
        private String name;

        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

    }
    public class Year {

        @SerializedName("_id")
        @Expose
        private String id;
        @SerializedName("datas")
        @Expose
        private List<Data_> datas = null;

        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public List<Data_> getDatas() {
            return datas;
        }

        public void setDatas(List<Data_> datas) {
            this.datas = datas;
        }

    }

    public class Color {

        @SerializedName("_id")
        @Expose
        private String id;
        @SerializedName("datas")
        @Expose
        private List<Data_> datas = null;

        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public List<Data_> getDatas() {
            return datas;
        }

        public void setDatas(List<Data_> datas) {
            this.datas = datas;
        }

    }
}
