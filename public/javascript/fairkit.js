let formData={};

let editData = {};

let addDeviceData={};


let fairkitData = firstData.fairkitData;
$(() => {
    console.log(fairkitData);

    fairkitData.forEach((item)=>{
        renderFairkitData(item)
    })

    firstData.categoryID.forEach((item)=>{
        $("#modal-categoryID").append(`<option>${item.CategoryID}</option>`)
    })


    $('#modal-categoryID').on('change', function() {
        getDeviceData(this.value)
    });

    $("#Toggle-form").click(() => {
        $("#Form").toggle()
    })
    $("button.remove-btn").click((e)=>{
        let parent = e.currentTarget.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement;

        let removeDeviceData={
            id:$(parent).attr("idFAirKit"),
            deviceId:$(e.currentTarget.parentElement.parentElement).attr("idDevice")
        }
        $(e.currentTarget.parentElement.parentElement).remove();
        removeDevice(removeDeviceData);
    })
    $("button.btn").click((e)=>{
        let parent = e.currentTarget.parentElement.parentElement;
        // console.log(e.currentTarget)
        let id = $(parent).attr("idFAirKit")
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
        formData.ListDevice=[];
        $.ajax({
            type: 'post',
            url: '/fairkit/add',
            data: JSON.stringify(formData),
            contentType: "application/json",
            success: function (data) {
                // console.log(data);
                $(".form-input").val('')
                renderFairkitData(data)
                alert("upload success")
            }
        })
    }
}

function searchData() {
    getData();
    $.ajax({
        type: 'post',
        url: '/fairkit/search',
        data: JSON.stringify(formData),
        contentType: "application/json",
        success: function (data) {
            $("#Data-row").empty();
            data = JSON.parse(data);
            data.forEach((item)=>{
                renderFairkitData(item)
            })
        }
    })
}

function previous() {
    let url = window.location.href
    let newPage = parseInt(url[url.length-1])-1;
    window.location.replace(`http://localhost:3000/fairkit/${newPage}`);
}
function next() {
    let url = window.location.href
    let newPage = parseInt(url[url.length-1])+1;
    window.location.replace(`http://localhost:3000/fairkit/${newPage}`);
}

function getData() {
    formData.FAirKitID = $("#FAirKitID").val();
    formData.Status = $("#Status").val();
}

function checkData() {
    if(!formData.FAirKitID) {
        alert("FAirKitID empty")
        return false;
    }
    else if(!formData.Status){
        alert("Status empty")
        return false;
    }
    else return true;
}



function renderListDevice(data) {
    if (data){
        let html = "";
        data.forEach((item)=>{
            html += `<div class="listDeviceItem" idDevice="${item.deviceId}">
                    <span>${item.deviceId}</span>
                    <span><button type='button' class="btn remove-btn"><i class="fa fa-close"></i></button></span>
                </div>`
        })
        return html;
    } else return false;

}



function renderFairkitData(item) {
    $("#Data-row").append(`<tr class="d-flex col-md-12 row" idFairkit="${item._id}">
                                <td class="col-md-2 data data-name"><input disabled value="${item.FAirKitID}"></td>
                                <td class="col-md-3 data data-status"><input disabled value="${item.Status}"></td>
                                <td class="col-md-4 data data-listDevice">
                                    <div class="dropdown">
                                      <button type="button" class="btn dropdown-toggle" data-toggle="dropdown">
                                        list devices
                                      </button>
                                      <div class="dropdown-menu">
                                        ${renderListDevice(item.ListDevice)}
                                      </div>
                                    </div>
                                </td>
                                <td class="col-md-3">
                                    <button class="btn btn-dark add-button" data-toggle="modal" data-target="#myModal"><i class="fa fa-plus"></i></button>
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
    editData.FAirKitID=product.find(".data-name input").val()
    editData.Status=product.find(".data-deviceID input").val()


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

function addClick(product,id) {
    addDeviceData.id = id;
    addDeviceData.product = product;
    console.log(product);
}

function deleteProduct(product,id) {
    $.ajax({
        type: 'post',
        url: '/fairkit/delete',
        data: JSON.stringify({_id: id}),
        contentType: "application/json",
        success: function () {
            product.remove();
            alert("delete success"+id)
        }
    })

}
function addDevice() {
    addDeviceData.deviceId=$("#modal-DeviceID").val();
    $.ajax({
        type: 'post',
        url: '/fairkit/addDevice',
        data: JSON.stringify(addDeviceData),
        contentType: "application/json",
        success: function () {
            addDeviceData.product.find(".dropdown-menu").append(`<div class="listDeviceItem" iddevice="${addDeviceData.deviceId}">
                    <span>${addDeviceData.deviceId}</span>
                    <span><button type="button" class="btn remove-btn"><i class="fa fa-close"></i></button></span>
                </div>`)
            alert("add success")

        }
    })
}

function removeDevice(data) {

    $.ajax({
        type: 'post',
        url: '/fairkit/removeDevice',
        data: JSON.stringify(data),
        contentType: "application/json",
        success: function () {
            alert("remove success")
        }
    })
}

function editProduct() {
    console.log(editData);
    $.ajax({
        type: 'post',
        url: '/fairkit/edit',
        data: JSON.stringify(editData),
        contentType: "application/json",
        success: function () {
            alert("edit success"+editData._id)
        }
    })
}


function getDeviceData(categoryID) {
    $.ajax({
        type: 'post',
        url: '/fairkit/getDeviceData',
        data: JSON.stringify({categoryID:categoryID}),
        contentType: "application/json",
        success: function (data) {
            console.log(data);
            $("#modal-DeviceID").empty()
            data.forEach((item)=>{
                $("#modal-DeviceID").append(`<option>${item.Name}</option>`)
            })
        }
    })
}
