package com.bismillah.app.Model.LocalModel;

import com.bismillah.app.Model.OutStationModel;

import java.util.Date;

public class OutstationLocalModel {
    private String tripeType = "";

    public String getDistancelable() {
        return distancelable;
    }

    public void setDistancelable(String distancelable) {
        this.distancelable = distancelable;
    }

    private String distancelable = "";
    private OutStationModel.VehicleList vehicleList;
    private Date startDate;
    private Date endDate;
    public Date getStartDate() {
        return startDate;
    }

    public void setStartDate(Date startDate) {
        this.startDate = startDate;
    }

    public Date getEndDate() {
        return endDate;
    }

    public void setEndDate(Date endDate) {
        this.endDate = endDate;
    }



    public OutstationLocalModel(String tripeType, OutStationModel.VehicleList vehicleList,Date startDate,Date endDate,String distancelable) {
        this.tripeType = tripeType;
        this.vehicleList = vehicleList;
        this.startDate = startDate;
        this.endDate = endDate;
        this.distancelable = distancelable;
    }



    public String getTripeType() {
        return tripeType;
    }

    public void setTripeType(String tripeType) {
        this.tripeType = tripeType;
    }

    public OutStationModel.VehicleList getVehicleList() {
        return vehicleList;
    }

    public void setVehicleList(OutStationModel.VehicleList vehicleList) {
        this.vehicleList = vehicleList;
    }


}

