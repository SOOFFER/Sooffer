import Payments from "./payments.model";

export const createPayment = async (payment) => {
    let response = {
        data : {},
        message : "Service Unavailable",
        status : false,
        statusCode : 503
    }
    try{
        let checkPayment = await Payments.findOne({transactionId:payment.transactionId}).lean().exec();
        if(checkPayment)
            throw new Error("Transaction Already Exists.")

        console.log("payment",JSON.stringify(payment))

        let newPayment = new Payments();

        newPayment.userId = payment.userId;
        newPayment.userType = payment.userType;
        newPayment.paymentType = payment.paymentType;
        newPayment.status = payment.status;
        newPayment.referenceId = payment.referenceId;
        newPayment.transactionId = payment.transactionId;
        newPayment.description = payment.description;
        newPayment.amount = payment.amount;
        newPayment.currency = payment.currency;

        let paymentInfo = await newPayment.save();
        response.data = {
            paymentInfo : paymentInfo
        };
        response.message = "Payment Updated.";
        response.status = true;
        response.statusCode = 200;
    }catch(error){
        response.data = {};
        response.message = error.message;
        response.status = false;
        response.statusCode = 503;
    }
    console.log("_____________response create paymaent",response)
    return response;
}

export const getPayment = async (payment) => {
    let response = {
        data : {},
        message : "Service Unavailable",
        status : false,
        statusCode : 503
    }
    try{
        console.log("payment.transactionId",payment.transactionId)
        console.log("____________payment.referenceId");
        let checkPayment = await Payments.findOne({referenceId: payment.referenceId}).lean().exec();
        if(!checkPayment)
            throw new Error("Transaction Not Exists.")

        response.data = {
            paymentInfo : checkPayment
        };
        response.message = "Payment Exists.";
        response.status = true;
        response.statusCode = 200;
    }catch(error){
        response.data = {};
        response.message = error.message;
        response.status = false;
        response.statusCode = 503;
    }
    return response;
}

export const updatePayment = async (payment) => {
    let response = {
        data : {},
        message : "Service Unavailable",
        status : false,
        statusCode : 503
    }
    try{
        let paymentUpdate = await Payments.findOne({referenceId: payment.referenceId}).exec();
        if(!paymentUpdate)
            throw new Error("Transaction Not Exists.")

        // paymentUpdate.userId = payment.userId || paymentUpdate.userId;
        // paymentUpdate.userType = payment.userType || paymentUpdate.userType;
        // paymentUpdate.paymentType = payment.paymentType || paymentUpdate.paymentType;
        paymentUpdate.status = payment.status || paymentUpdate.status;
        // paymentUpdate.referenceId = payment.referenceId || paymentUpdate.referenceId;
        // paymentUpdate.transactionId = payment.transactionId || paymentUpdate.transactionId;
        paymentUpdate.description = payment.description || paymentUpdate.description;
        paymentUpdate.amount = payment.amount || paymentUpdate.amount;
        paymentUpdate.currency = payment.currency || paymentUpdate.currency;
        paymentUpdate.referenceId = payment.referenceId || paymentUpdate.referenceId;
        let paymentInfo = await paymentUpdate.save()

        response.data = {
            paymentInfo : paymentInfo
        };
        response.message = "Payment Exists.";
        response.status = true;
        response.statusCode = 200;
    }catch(error){
        response.data = {};
        response.message = error.message;
        response.status = false;
        response.statusCode = 503;
    }
    return response;
}