console.log('In Schedule node')
let apitable;
$(document).ready(function() {
    apitable = $('#tabexapi').DataTable({
        "deferRender": true,
        "paging": true,
        // "lengthChange": false,
        // "searching": false,
        "ordering": true,
        "info": true,
        "autoWidth": false,
        "sDom": 'lfrtip'
    });
    PopulateItemsTable('admin');
});

function PopulateItemsTable(user) {
    $.ajax({
        type: "POST",
        url: "/users/api/getexapi",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({
            username: user,
            un: "2019/01/01",

        }),
        dataType: "json",
        success: function(response) {

            console.log('Data from Db', response);
            console.log(response)

            var jsonObject = response;
            var result = jsonObject.map(function(item) {
                console.log(item);
                var result = [];
                result.push(item.author);
                result.push(item.categories);
                result.push(item.content);
                result.push(item.title);
                // result.push(addbtn());

                // .... add all the values required
                return result;
            });
            apitable.rows.add(result); // add to DataTable instance
            apitable.draw(); // always redraw
        }
    });

}