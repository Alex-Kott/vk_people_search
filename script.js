
function showResults(response){
    $("#search-result").html("");
    if(response[0] == 0){
        $("#search-result").append("<h3>Ничего не найдено</h3>")
    }
    for(var i = 1; i<=response[0]; i++){
        $("#search-result").append('<a href="http://vk.com/id'+response[i].uid+'"><div class="person"><center><img src="'+response[i].photo_200+'"></center><p>'+response[i].first_name+' '+response[i].last_name+'</p> </div></a>')
    }
}

var fields = {}

function getCity(access_token, city){
        var country_id = $("#search-country").val();
        var query={
            access_token: access_token,
            country_id: country_id,
            q: city,
            count: 1,
            need_all:0
        }

        $.ajax({
            url: "https://api.vk.com/method/database.getCities",
            dataType: "jsonp",
            data: query,
            success: function( data ) {
                
                if(data.error != undefined){
                    $("#auth_container").trigger("click"); //if token are invalid -- go to reauthorization
                    return 0;
                }


                fields.name = $("#search-name").val();
                fields.surname = $("#search-surname").val();                                                            
                fields.city = data.response[0].cid;
                fields.age_from = $("#search-start-age").val();
                fields.age_to = $("#search-end-age").val();
                fields.birth_day = $("#search-birth-day").val();
                fields.birth_month = $("#search-birth-month").val();
                fields.birth_year = $("#search-birth-year").val();

                var query = {
                    access_token: access_token,
                    count: 1000,
                    q: fields.name+" "+fields.surname,
                    fields: "photo_200",
                    city: fields.city,
                    age_from: fields.age_from,
                    age_to: fields.age_to,
                    birth_day: fields.birth_day,
                    birth_month: fields.birth_month,
                    birth_year: fields.birth_year

                };


                $.ajax({
                    url: "https://api.vk.com/method/users.search",
                    dataType: "jsonp",
                    data: query,
                    success: function( data ) {
                        showResults(data.response);
                      
                    }
                });
              },
            error:function(){
                console.log("Something went wrong");
            }
        });
    }


$(document).ready(function () {

    var fragments = $.deparam.fragment(window.location.hash);
    var access_token = $.cookie('access_token');



    // if there is an access_token in URL, set cookie and redirect
    if (fragments.access_token) {
        $.cookie('access_token', fragments.access_token, {expires: (fragments.expires_in / 86400) || undefined});
        window.location = window.location.pathname;
    }

    $("#auth_container").click(function(){
        window.location = 'https://oauth.vk.com/authorize?client_id=5174668&scope=&redirect_uri='
                        + window.location +
                        '&display=page&v=5.4&response_type=token';
    }).toggle(!access_token);


    $("#search-submit").click(function(e){
        e.preventDefault();
        e.stopPropagation();
        getCity(access_token, $("#search-city").val()) ;
    });



});



var date = new Date();
for(var i = date.getFullYear(); i>1950; i--){
    $("#search-birth-year").append('<option value ="'+i+'"> '+i+'</option>');
    }


$("#search-start-age").on("change", function(){

    var a = $("#search-start-age").val();
    var b = $("#search-end-age").val();
    if(a>b){
        $("#search-end-age").html("");
        $("#search-end-age").append('<option value="0"> Max. age </option>');
        for(var i = a; i<80; i++){

            $("#search-end-age").append("<option value="+i+"> "+i+" </option>");
        }
        return 0;
    }
    $("#search-end-age").html("");
    $("#search-end-age").append('<option value="0"> Max. age </option>');

    for(var i = a; i<80; i++){
        $("#search-end-age").append("<option value="+i+"> "+i+" </option>");
    }
    $("#search-end-age").val(b);
})

for(var i=14; i<=80; i++){
    $("#search-start-age").append("<option value="+i+"> "+i+" </option>");
}

for(var i=14; i<=80; i++){
    $("#search-end-age").append("<option value="+i+"> "+i+" </option>");
}