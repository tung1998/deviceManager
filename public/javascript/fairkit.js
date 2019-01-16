let formData={};

let editData = {};


$(() => {
    console.log(fairkitData);

    fairkitData.forEach((item)=>{
        renderFairkitData(item)
    })

    $("button.btn").click((e)=>{
        let parent = e.currentTarget.parentElement.parentElement;
        // console.log(e.currentTarget)
        let id = $(parent).attr("idFAirNet")
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
    formData.ListDevice = $("#ListDevice").val();
    formData.Status = $("#Status").val();
}

function checkData() {
    if(!formData.FAirKitID) {
        alert("FAirKitID empty")
        return false;
    }
    else if(!formData.ListDevice){
        alert("ListDevice empty")
        return false;
    }
    else if(!formData.Status){
        alert("Status empty")
        return false;
    }
    else return true;
}





function renderFairkitData(item) {
    $("#Data-row").append(`<tr class="d-flex col-md-12 row" idFairkit="${item._id}">
                                <td class="col-md-3 data data-name"><input disabled value="${item.FAirKitID}"></td>
                                <td class="col-md-3 data data-description"><input disabled value="${item.ListDevice}"></td>
                                <td class="col-md-3 data data-deviceID"><input disabled value="${item.Status}"></td>
                                <td class="col-md-3">
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
    editData.ListDevice=product.find(".data-description input").val()
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
