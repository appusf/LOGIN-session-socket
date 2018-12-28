console.log("In dash")
    // var user = "{{name.username}}";
var user = $('#usernamee').val();
console.log($('#usernamee').val());
console.log(user);
var table;

var utc = new Date().toJSON().slice(0, 10).replace(/-/g, '/');
console.log(new Date().toLocaleTimeString());


$(document).ready(function() {
    table = $('#myTable').DataTable({
        "deferRender": true,
        "paging": true,
        // "lengthChange": false,
        // "searching": false,
        "ordering": true,
        "info": true,
        "autoWidth": false,
        "sDom": 'lfrtip'
    });
    PopulateItemsTable(user);

    // $('#myTable').on('click', '#btnedit', function(row) {
    //     let data = table.row($(this).parents('tr')).data();
    //     console.log(data);
    //     editfunc(data[0], data[1], data[2], data[3])
    // })

    // $('#myTable').on('click', '#btndel', function(row) {
    //     let data = table.row($(this).parents('tr')).data();
    //     delfunc(data[0]);
    // })
});

function PopulateItemsTable(user) {
    $.ajax({
        type: "POST",
        url: "/users/viewlog",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({
            username: user,
            un: "2019/01/01",

        }),
        dataType: "json",
        success: function(response) {
            console.log(response);

            var jsonObject = response;
            var result = jsonObject.map(function(item) {
                var result = [];
                result.push(item.username);
                result.push(item.name);
                result.push(item.logd);
                result.push(item.logt);
                // result.push(addbtn());

                // .... add all the values required
                return result;
            });
            table.rows.add(result); // add to DataTable instance
            table.draw(); // always redraw
        }
    });

}