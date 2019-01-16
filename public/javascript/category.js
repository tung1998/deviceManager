let formData={};

let editData = {};


$(() => {
    console.log(categoryData);

    categoryData.forEach((item)=>{
        renderCategoryData(item)
    })

    $("#Toggle-form").click(() => {
        $("#Form").toggle()
    })

    $("button.btn").click((e)=>{
        let parent = e.currentTarget.parentElement.parentElement;
        // console.log(e.currentTarget)
        let id = $(parent).attr("idCategory")
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
            url: '/category/add',
            data: JSON.stringify(formData),
            contentType: "application/json",
            success: function (data) {
                // console.log(data);
                $(".form-input").val('')
                renderCategoryData(data)
                alert("upload success")
            }
        })
    }
}

function searchData() {
    getData();
    $.ajax({
        type: 'post',
        url: '/category/search',
        data: JSON.stringify(formData),
        contentType: "application/json",
        success: function (data) {
            $("#Data-row").empty();
            data = JSON.parse(data);
            data.forEach((item)=>{
                renderCategoryData(item)
            })
        }
    })
}

function getData() {
    formData.CategoryID = $("#CategoryID").val();
    formData.list = [{Code:$("#CategoryID").val()+" 1",onUsing: false}];
    formData.Name = $("#Name").val();
    formData.Description = $("#Description").val();
    formData.FAirNetID = $("#FAirNetID").val();
    formData.DataSheet = $("#DataSheet").val();
}

function previous() {
    let url = window.location.href
    let newPage = parseInt(url[url.length-1])-1;
    window.location.replace(`http://localhost:3000/category/${newPage}`);
}
function next() {
    let url = window.location.href
    let newPage = parseInt(url[url.length-1])+1;
    window.location.replace(`http://localhost:3000/category/${newPage}`);
}

function checkData() {
    if(!formData.Name) {
        alert("name empty")
        return false;
    }
    else if(!formData.Description){
        alert("description empty")
        return false;
    }
    else if(!formData.CategoryID){
        alert("CategoryID empty")
        return false;
    }
    else if(!formData.FAirNetID){
        alert("FAirNetID empty")
        return false;
    }else if(!formData.DataSheet){
        alert("DataSheet empty")
        return false;
    }
    else return true;
}





function renderCategoryData(item) {
    $("#Data-row").append(`<tr class="d-flex col-md-12 row" idCategory="${item._id}">
                                <td class="col-md-1 data data-categoryID"><input disabled value="${item.CategoryID}"></td>
                                <td class="col-md-2 data data-name"><input disabled value="${item.Name}"></td>
                                <td class="col-md-2 data data-description"><input disabled value="${item.Description}"></td>
                                <td class="col-md-2 data data-fAirNetID"><input disabled value="${item.FAirNetID}"></td>
                                <td class="col-md-2 data data-dataSheet"><input disabled value="${item.DataSheet}"></td>
                                <td class="col-md-1 data data-amount"><input disabled value="${item.list.length}"></td>
                                <td class="col-md-2">
                                   <button class="btn btn-dark add-button"><i class="fa fa-plus"></i></button>
                                   <button class="btn btn-primary edit-button"><i class="fa fa-edit"></i></button>
                                   <button class="btn btn-danger delete-button"><i class="fa fa-trash"></i></button>
                                   <button class="btn btn-success ok-button" style="display: none"><i class="fa fa-check-circle"></i></button>
                                   <button class="btn btn-secondary cancel-button" style="display: none"><i class="fa fa-ban"></i></button>
                        </td></tr>`)
}



function addClick(product,id) {
    let category = categoryData[searchIndex(categoryData,id)];
    let newObj = {Code:category.CategoryID+" "+(category.list.length+1),onUsing: false}
    category.list.push(newObj)

    $.ajax({
        type: 'post',
        url: '/category/addMore',
        data: JSON.stringify({_id: id,newValue: newObj}),
        contentType: "application/json",
        success: function () {
            product.find(".data-amount>input").val(parseInt(product.find(".data-amount>input").val())+1);
            alert("delete success"+id)
        }
    })
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

function searchIndex(array,objID) {
    for(let i = 0;i<array.length;i++){
        if(array[i]._id = objID){
            return i;
        }
    }
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
    editData.Name=product.find(".data-name input").val()
    editData.Description=product.find(".data-description input").val()
    editData.CategoryID=product.find(".data-categoryID input").val()
    editData.FAirNetID=product.find(".data-fAirNetID input").val()
    editData.DataSheet=product.find(".data-dataSheet input").val()


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
        url: '/category/delete',
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
        url: '/category/edit',
        data: JSON.stringify(editData),
        contentType: "application/json",
        success: function () {
            alert("edit success"+editData._id)
        }
    })
}
