let formData={};

let editData = {};

let CategoryNameList = data.categoryNamelist;
let deviceData = data.deviceData;

let addCalibrateFunctionData = {
    DeviceID:"",
    data:{}
};

$(() => {
    // console.log(deviceData);

    $("#Toggle-form").click(() => {
        $("#Form").toggle();
    })
    // CategoryNameList = getCategoryName();

    deviceData.forEach((item)=>{
        renderDeviceData(item)
    })

    renderSelect($("#CategoryName"))


    $(document).on("click",".delete-button",(e)=>{
        let parent = e.currentTarget.parentElement.parentElement;

        addCalibrateFunctionData.data.CalibrateFunction=$(parent).find(".data-CalibrateFunction").text();
        addCalibrateFunctionData.data.QualityFlag=$(parent).find(".data-QualityFlag").text();
        addCalibrateFunctionData.data.CalibrateDate=$(parent).find(".data-CalibrateDate").text();
        console.log(addCalibrateFunctionData);
        $(parent).remove();
        deleteCalibrateFunctionItem(addCalibrateFunctionData);
    })

    $("button.btn").click((e)=>{
        let parent = e.currentTarget.parentElement.parentElement;
        // console.log(e.currentTarget)
        let id = $(parent).attr("idDevice")
        // console.log(id)
        if($(e.currentTarget).hasClass("edit-button")){
            editClick($(parent),id);
        }else if($(e.currentTarget).hasClass("delete-button")){
            deleteClick($(parent),id)
        }else if($(e.currentTarget).hasClass("ok-button")){
            okClick($(parent),id);
        }else if($(e.currentTarget).hasClass("add-button")){
            addClick($(parent),id);
        }else {
            cancelClick($(parent),id);
        }
    })
});

function uploadData() {
    getData();
    if(checkData()){
        $.ajax({
            type: 'post',
            url: '/device/add',
            data: JSON.stringify(formData),
            contentType: "application/json",
            success: function (data) {
                // console.log(data);
                $(".form-input").val('')
                renderDeviceData(data)
                alert("upload success")
            }
        })
    }
}

// function getCategoryID() {
//     $.ajax({
//         type: 'post',
//         url: '/device/getCategoryID',
//         contentType: "application/json",
//         success: function (data) {
//             console.log(data);
//             return data;
//         }
//     })
// }

function renderSelect(locate) {
    CategoryNameList.forEach((item)=>{
        locate.append(`<option value="${item.Name}">${item.Name}</option>`)
    })
}

function searchData() {
    getData();
    $.ajax({
        type: 'post',
        url: '/device/search',
        data: JSON.stringify(formData),
        contentType: "application/json",
        success: function (data) {
            $("#Data-row").empty();
            data = JSON.parse(data);
            data.forEach((item)=>{
                renderDeviceData(item)
            })
        }
    })
}

function previous() {
    let url = window.location.href
    let newPage = parseInt(url[url.length-1])-1;
    window.location.replace(`http://localhost:3000/device/${newPage}`);
}
function next() {
    let url = window.location.href
    let newPage = parseInt(url[url.length-1])+1;
    window.location.replace(`http://localhost:3000/device/${newPage}`);
}

function getData() {
    formData.Name = $("#Name").val();
    formData.Status = $("#Status").val();
    formData.CategoryName = $("#CategoryName").val();
    formData.CalibrateList = [];
}

function checkData() {
    if(!formData.Name) {
        alert("Name empty")
        return false;
    }
    else if(!formData.Status){
        alert("Status empty")
        return false;
    }else if(!formData.CategoryName){
        alert("CategoryName empty")
        return false;
    }
    else return true;
}

function getOption(value) {
    let data="";
    CategoryNameList.forEach((item)=>{
        if(item.Name==value) data=data+`<option selected value="${item.Name}">${item.Name}</option>`
        else data=data+`<option value="${item.Name}">${item.Name}</option>`
    })
    return data;
}



function renderDeviceData(item) {
    $("#Data-row").append(`<tr class="d-flex col-md-12 row" idDevice="${item._id}">
                                <td class="col-md-2"><input class="data data-Name" disabled value="${item.Name}"></td>
                                <td class="col-md-4 "><input class="data data-Status" disabled value="${item.Status}"></td>
                                <td class="col-md-3 ">
                                    <select class="data data-CategoryName" disabled value="${item.CategoryName}">
                                        ${getOption(item.CategoryName)}
                                    </select>
                                </td>
                                <td class="col-md-3">
                                    <button class="btn btn-dark add-button" data-toggle="modal" data-target="#myModal"><i class="fa fa-eye"></i></button>
                                   <button class="btn btn-primary edit-button"><i class="fa fa-edit"></i></button>
                                   <button class="btn btn-danger delete-button"><i class="fa fa-trash"></i></button>
                                   <button class="btn btn-success ok-button" style="display: none"><i class="fa fa-check-circle"></i></button>
                                   <button class="btn btn-secondary cancel-button" style="display: none"><i class="fa fa-ban"></i></button>
                        </td></tr>`)
}








function editClick(product,id) {
    product.find(`.ok-button`).show()
    product.find(`.cancel-button`).show()
    product.find(`.edit-button`).hide()
    product.find(`.delete-button`).hide();

    // $(document).find(`.data input`).prop('disabled',true);
    product.find(`.data`).prop('disabled',false);
    product.find(`.data`).prop('disabled',false);
    // (confirm("edit click"+id));
}

function deleteClick(product,id) {
    if(confirm("Delete Product?")){
        deleteProduct(product,id);
    }
    // alert("delete click"+id);

}
function okClick(product,id) {
    product.find(`.ok-button`).hide();
    product.find(`.cancel-button`).hide();
    product.find(`.edit-button`).show()
    product.find(`.delete-button`).show();

    editData._id = id;
    editData.Name=product.find(".data-Name input").val()
    editData.Status=product.find(".data-Status input").val()
    editData.CategoryName=product.find(".data-CategoryName input").val()


    product.find(`.data`).prop('disabled',true);
    editProduct();
    // alert("ok click"+id);
}
function cancelClick(product,id) {
    product.find(`.ok-button`).hide()
    product.find(`.cancel-button`).hide()
    product.find(`.edit-button`).show()
    product.find(`.delete-button`).show();

    product.find(`.data`).prop('disabled',true)
    // alert("cancel click"+id);
}

function addClick(product,id) {
    addCalibrateFunctionData.DeviceID=id;
    $("#Calibrate-data").empty();
    for(let i=0;i<deviceData.length;i++){
        if(deviceData[i]._id==id){
            $("#modal-title").text(`${deviceData[i].Name}`);
            deviceData[i].CalibrateList.forEach((item)=>{
                $("#Calibrate-data").append(`<tr class="d-flex col-md-12 row" idDevice="${item._id}">
                                <td class="col-md-7 data data-CalibrateFunction" >${item.CalibrateFunction}</td>
                                <td class="col-md-2 data data-QualityFlag" >${item.QualityFlag}</td>
                                <td class="col-md-2 data data-CalibrateDate" >${item.CalibrateDate}</td>
                                <td class="col-md-1" >
                                <button class="btn btn-dark delete-button" ><i class="fa fa-close"></i></button>
                                </td></tr>`)
            })
        }
    }
}


function deleteProduct(product,id) {
    $.ajax({
        type: 'post',
        url: '/device/delete',
        data: JSON.stringify({_id: id}),
        contentType: "application/json",
        success: function () {
            product.remove();
            alert("delete success"+id)
        }
    })

}


function editProduct() {
    console.log(editData);
    $.ajax({
        type: 'post',
        url: '/device/edit',
        data: JSON.stringify(editData),
        contentType: "application/json",
        success: function () {
            alert("edit success"+editData._id)
        }
    })
}



function addCalibrateFunction() {
    addCalibrateFunctionData.data.CalibrateFunction=$("#modal-CalibrateFunction").val();
    addCalibrateFunctionData.data.QualityFlag=$("#modal-QualityFlag").val();
    addCalibrateFunctionData.data.CalibrateDate=$("#modal-CalibrateDate").val();
    $.ajax({
        type: 'post',
        url: '/device/addCalibrateFunction',
        data: JSON.stringify(addCalibrateFunctionData),
        contentType: "application/json",
        success: function () {
            $("#Calibrate-data").append(`<tr class="d-flex col-md-12 row" idDevice="${item._id}">
                                <td class="col-md-7" >${$("#modal-CalibrateFunction").val()}</td>
                                <td class="col-md-2" >${$("#modal-QualityFlag").val()}</td>
                                <td class="col-md-2" >${$("#modal-CalibrateDate").val()}</td>
                                <td class="col-md-1" >
                                <button class="btn btn-dark delete-button" ><i class="fa fa-close"></i></button>
                                </td></tr>`)
        }
    })
}


function deleteCalibrateFunctionItem(data) {
    $.ajax({
        type: 'post',
        url: '/device/deleteCalibrateFunction',
        data: JSON.stringify(data),
        contentType: "application/json",
        success: function () {
            alert("success")
        }
    })
}
