let formData={};

let editData = {};


$(() => {
    console.log(deviceData);

    $("#Toggle-form").click(() => {
        $("#Form").toggle();
    })

    deviceData.forEach((item)=>{
        renderDeviceData(item)
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
    formData.DeviceID = $("#DeviceID").val();
    formData.Status = $("#Status").val();
    formData.CalibrateFunction = $("#CalibrateFunction").val();
    formData.QualityFlag = $("#QualityFlag").val();
    formData.CalibrateDate = $("#CalibrateDate").val();
}

function checkData() {
    if(!formData.DeviceID) {
        alert("DeviceID empty")
        return false;
    }
    else if(!formData.Status){
        alert("Status empty")
        return false;
    }
    else if(!formData.CalibrateFunction){
        alert("CalibrateFunction empty")
        return false;
    }
    else if(!formData.QualityFlag){
        alert("QualityFlag empty")
        return false;
    }else if(!formData.CalibrateDate){
        alert("CalibrateDate empty")
        return false;
    }
    else return true;
}





function renderDeviceData(item) {
    $("#Data-row").append(`<tr class="d-flex col-md-12 row" idDevice="${item._id}">
                                <td class="col-md-2 data data-DeviceID"><input disabled value="${item.DeviceID}"></td>
                                <td class="col-md-2 data data-Status"><input disabled value="${item.Status}"></td>
                                <td class="col-md-2 data data-CalibrateFunction"><input disabled value="${item.CalibrateFunction}"></td>
                                <td class="col-md-2 data data-QualityFlag"><input disabled value="${item.QualityFlag}"></td>
                                <td class="col-md-2 data data-CalibrateDate"><input disabled value="${item.CalibrateDate}"></td>
                                <td class="col-md-2">
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
    product.find(`.data input`).prop('disabled',false);
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
    editData.DeviceID=product.find(".data-DeviceID input").val()
    editData.Status=product.find(".data-Status input").val()
    editData.CalibrateFunction=product.find(".data-CalibrateFunction input").val()
    editData.QualityFlag=product.find(".data-QualityFlag input").val()
    editData.CalibrateDate=product.find(".data-CalibrateDate input").val()


    product.find(`.data input`).prop('disabled',true);
    editProduct();
    // alert("ok click"+id);
}
function cancelClick(product,id) {
    product.find(`.ok-button`).hide()
    product.find(`.cancel-button`).hide()
    product.find(`.edit-button`).show()
    product.find(`.delete-button`).show();

    product.find(`.data input`).prop('disabled',true)
    // alert("cancel click"+id);
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
