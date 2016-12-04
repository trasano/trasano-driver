/*************************************************************************************************************
*
* Project: Trasano
* author: @rvallinot 
*
**************************************************************************************************************/

/*************************************************************************************************************
* PAGINATION functions
**************************************************************************************************************/
/* 
 * Expects: num of pages; page active
 * Returns: Create html code for bootstrap pagination. 
 */
function createPagination(pages, active) {
    var htmlCode = "";
    var item = 1;
    for (i = 0; i < pages; i++) {
        if (i === active) {
            htmlCode = htmlCode + "<li class='active'><a href='javascript:showService(" + i + ");'>" + item + 
                "<span class='sr-only'>(current)</span></a></li>";
        } else {
            htmlCode = htmlCode + "<li><a href='javascript:showService(" + i + ");'>" + item + "</a></li>";
        }
        item = item + 1;
    }
    return htmlCode;
}
/*************************************************************************************************************
* SERVICE functions
**************************************************************************************************************/
/* 
 * Expects: service position of json stored in local storage
 * Returns: incidence.
 */
function getIncidenceById(id) {
    var services = JSON.parse(localStorage.getItem("jsonServices"));
    return services[id].incidence;
}
/* 
 * Expects: void
 * Returns: True if a services has been requested. 
 */
function isService() {
    return localStorage.getItem("jsonServices")!= null; 
}
/* 
 * Expects: void
 * Returns: Show modal if there are no services for the ambulance configured 
 */
function showServiceALERT () {
    $("#trasanoModalHeader").empty();
    $("#trasanoModalBody").empty();
    $("#trasanoModalFooter").empty();

    $("#trasanoModalHeader").append("<h4>Servicio de Ambulancia</h4>");

    $("#trasanoModalBody").append("<div class='alert alert-danger' role='alert'>" + 
            "<p><span class='glyphicon glyphicon-thumbs-down' aria-hidden='true'></span> <strong>No hay peticiones de servicio!</strong></p> " + 
        "</div>" + 
        "<div class='alert alert-info' role='alert'>" +  
            "<p><span class='glyphicon glyphicon-ok' aria-hidden='true'></span> Conductor: " + localStorage.getItem("numDriver") + "</p>" +
            "<p><span class='glyphicon glyphicon-ok' aria-hidden='true'></span> Ambulancia: " + localStorage.getItem("numAmbulance") + "</p>" +
        "</div>");

    $("#trasanoModalFooter").append(
        //"<a class='btn btn-default pull-right' href='javascript:closeTrasanoModal();' role='button'>SOLITAR</a>");
        "<button type='button' class='btn btn-default' data-dismiss='modal'>CERRAR</button>");

    $('#trasanoMODAL').modal('show');
}
/* 
 * Expects: service in json format
 * Returns: Create html code for trasano service
 */
function getServiceDescription (service) {
    switch (service.numClaim) {
        case 0:
            $('#servicePanel').removeClass().addClass('panel panel-success');
            break;
        case 1:
            $('#servicePanel').removeClass().addClass('panel panel-warning');
            break;
        default:
            $('#servicePanel').removeClass().addClass('panel panel-danger');
    }
    
    var date = new Date();
    if (service.serviceTime != null && service.serviceTime != "") {
        date.setTime(service.serviceTime);
    }

    htmlCode =
        "<div class='panel-heading'>Reclamaciones: " + service.numClaim + "</div>" + 
        "<div class='panel-body'>" + 
            "<p><strong>Hora: </strong>" + date.toLocaleTimeString() + " (" + date.toLocaleDateString() + ")</p>" +
            "<p><strong>Nombre: </strong>" + service.name + " " + service.surname + "</p>" +
            "<p><strong>Teléfono(s): </strong>" + service.telephone1 +  "  " + service.telephone2 + "</p>" +
            "<p><strong>Detalles: </strong>" + service.details + "</p>" +
            "<p><strong>Domicilio del paciente: </strong><a href='javascript:showMapModal(" + 
                service.latitude + ", " + service.longitude + ");'>" + service.patientHome + "</a>" +   
            " <a href='javascript:showMapModal(" + service.latitude + ", " + service.longitude + ");' class='btn btn-default btn-xs'>" + 
                    "<span class='glyphicon glyphicon-zoom-in'></span></a>" + 
            "</p>" +
            "<p><strong>Centro: </strong>" + service.headquarters + ", " + service.department  + "</p>" +            
            "<p><strong>Observaciones: </strong>" + service.comment + "</p>" + 
        "</div>";
    return htmlCode;
}
/* 
 * Expects: service id of json stored in local storage
 * Returns: Show status' buttons of id given.
 */
function getServiceButton(id) {
    var htmlCode = 
        "<a class='btn btn-default btn-lg' href='javascript:showIncidenceALERT("+ id + ");' role='button' id='incidenceButton'>Incidencia</a> " + 
        "<a class='btn btn-primary btn-lg' href='javascript:showStatusALERT("+ id + ");' role='button' id='statusButton'>Estado</a>";
    return htmlCode;
}
/* 
 * Expects: service position of json stored in local storage
 * Returns: service id.
 */
function getServiceById(id) {
    var services = JSON.parse(localStorage.getItem("jsonServices"));
    return services[id].idService;
}
/* 
 * Expects: service id of json stored in local storage
 * Returns: Show pagination and service description of id given.
 */
function showService (id) {
    if (id >= 0) {
        var services = JSON.parse(localStorage.getItem("jsonServices"));
        var servicesLength = Object.keys(services).length;

        // Create pagination
        $("#panelPagination").empty();
        $("#panelPagination").append(
            "<nav aria-label='Page navigation'>" +
                "<ul class='pagination pagination-lg'>" +
                    createPagination(servicesLength, id) +   
                "</ul></nav>");

        // Create service description
        $("#servicePanel").empty();
        $("#servicePanel").append(getServiceDescription(services[id]));

        // Create buttons
        $("#statusButton").empty();
        $("#statusButton").append(getServiceButton(id));
    } else {
        // Create Warning! page
        $("#panelPagination").empty();
        $("#servicePanel").empty();
        $('#servicePanel').removeClass().addClass('panel panel-warning');
        $("#servicePanel").append(
            "<div class='panel-heading'>No hay servicios disponibles</div>" + 
                "<div class='panel-body'>" + 
                    "Actualizar para obtener servicios o consulte con la central." + 
                "</div>" + 
            "</div>");
        $("#statusButton").empty();
        $("#statusButton").append("<a class='btn btn-primary btn-lg' href='javascript:getServices();' role='button' " + 
            "id='incidenceButton'>Actualizar</a>");
    }
    
}
/*************************************************************************************************************
* DRIVER functions
**************************************************************************************************************/
/* 
 * Expects: numDriver and numAmbulance
 * Returns: If the parameters given are equals than the values stored in local storage returns true
 */
function checkDriver (numDriver, numAmbulance) {
    return numDriver === localStorage.getItem("numDriver") && numAmbulance === localStorage.getItem("numAmbulance"); 
}
/* 
 * Expects: void
 * Returns: True if the driver's data are stored on local storage. 
 */
function isDriverRegistered () {
    return localStorage.getItem("numDriver")!= null && localStorage.getItem("numAmbulance")!= null && localStorage.getItem("name")!= null && localStorage.getItem("surname")!= null; 
}
/* 
 * Expects: void
 * Returns: Driver number, name and surname
 */
function showDriver() {
    $("#driverJumbotron").append(
        "<h1 class='text-justify'>"+ localStorage.getItem("numDriver") + "</h1>" +
        "<p class='text-justify'> " + localStorage.getItem("name") + " " + localStorage.getItem("surname") + "</p>" +    
        "<p class='text-justify'> Ambulancia: " + localStorage.getItem("numAmbulance") + "</p>");
}
/* 
 * Expects: void
 * Returns: Modify driver's data
 */
function modifyDriver() {
    $("#modifyALERT").modal("hide");
    $("#trasanoModalHeader").empty();
    $("#trasanoModalBody").empty();
    $("#trasanoModalFooter").empty(); 
    window.location = "modifyDriver.html";        
}
/* 
 * Expects: void
 * Returns: Delete driver's data from local storage
 */
function deleteDriver() {
    localStorage.clear();
    window.location = "login.html";              
}
/*************************************************************************************************************
* MODAL functions
**************************************************************************************************************/
/* 
 * Expects: void
 * Returns: Close trasano modal and reload index.html
 */
function closeTrasanoModal() {
    $("#trasanoMODAL").modal("hide");
    window.location = "../index.html";
}
/* 
 * Expects: void
 * Returns: Close trasano modal and reload index.html
 */
function closeModalAndReload() {
    $("#trasanoMODAL").modal("hide");
    location.reload();
}
/* 
 * Expects: void
 * Returns: Show trasano modal for error
 */
function showErrorModal() {
    $("#trasanoModalBody").empty();
    $("#trasanoModalFooter").empty();

    $("#trasanoModalBody").append("<div class='alert alert-danger' role='alert'>" + 
    "<span class='glyphicon glyphicon-alert' aria-hidden='true'></span> " + 
    "<strong>Error!</strong> Error al enviar la petición.</div>");

    $("#trasanoModalFooter").append("<button type='button' class='btn btn-primary pull-right' data-dismiss='modal'>" + 
    "CERRAR</button>");

    $('#trasanoMODAL').modal('show'); 
}
/* 
 * Expects: Error given by Web Service
 * Returns: Show trasano modal for error
 */
function showErrorModal(error) {
    $("#trasanoModalBody").empty();
    $("#trasanoModalFooter").empty();

    $("#trasanoModalBody").append("<div class='alert alert-danger' role='alert'>" + 
    "<span class='glyphicon glyphicon-alert' aria-hidden='true'></span> " + 
    "<strong>Error!</strong> " + error + ".</div>");

    $("#trasanoModalFooter").append("<button type='button' class='btn btn-primary pull-right' data-dismiss='modal'>" + 
        "CERRAR</button>");

    $('#trasanoMODAL').modal('show'); 
}
/* 
 * Expects: service position of json stored in local storage
 * Returns: Show text area for incidence
 */
function showIncidenceALERT(id) {
    $("#trasanoModalHeader").empty();
    $("#trasanoModalBody").empty();
    $("#trasanoModalFooter").empty();
    $("#trasanoModalHeader").append("<h4>Registrar incidencia...</h4>");
    var incidence = getIncidenceById(id);

    if (incidence != null && incidence != "") {
            $("#trasanoModalBody").append(
                "<div class='form-group'>" + 
                    "<label for='message-text' class='control-label'>Incidencias:</label>" + 
                    "<textarea class='form-control' maxlength='300' disabled>" + incidence + "</textarea>" + 
                    "<label for='message-text' class='control-label'>Motivo:</label>" + 
                    "<textarea class='form-control' id='incidenceText' maxlength='100' placeholder='Máximo 100 caracteres...'></textarea>" + 
                "</div>");

    } else {
        $("#trasanoModalBody").append(
            "<div class='form-group'>" + 
                "<label for='message-text' class='control-label'>Motivo:</label>" + 
                "<textarea class='form-control' id='incidenceText' maxlength='100' placeholder='Máximo 100 caracteres...'></textarea>" + 
            "</div>");
    }

    $("#trasanoModalFooter").append(
        "<button type='button' class='btn btn-default' data-dismiss='modal'>CANCELAR</button>" +                   
        "<a class='btn btn btn-primary' href='javascript:executeIncidence(" + id + ");' role='button'>REGISTRAR</a>");
    $('#trasanoMODAL').modal('show'); 
}
/* 
 * Expects: service position of json stored in local storage
 * Returns: Show options to change status
 */
function showStatusALERT(id) {
    $("#trasanoModalHeader").empty();
    $("#trasanoModalBody").empty();
    $("#trasanoModalFooter").empty();
    $("#trasanoModalHeader").append("<h4>Estado del servicio...</h4>");

    $("#trasanoModalBody").append(
        "<div class='form-group'>" + 
            "<label for='message-text' class='control-label'>Seleccione el estado:</label>" + 
            "<select class='form-control' id='statusSelected'>" + 
                "<option value='2' selected>Recogido</option>" +
                "<option value='3'>Entregado</option>" + 
            "</select>" +
        '</div>');


    $("#trasanoModalFooter").append(
        "<button type='button' class='btn btn-default' data-dismiss='modal'>CANCELAR</button>" +                   
        "<a class='btn btn btn-primary' href='javascript:executeStatus(" + id + ");' role='button'>ACEPTAR</a>");
    $('#trasanoMODAL').modal('show'); 
}
/* 
 * Expects: service position of json stored in local storage
 * Returns: Show progress bar if textarea is not empty and execute -> setIncidence (Web Service call)
 */
function executeIncidence(id) {
    if ($("#incidenceText").val() == "") {
        $("#trasanoModalBody").append(
            "<div class='form-group'>" +
                "<div class='alert alert-danger' role='alert'><strong>Error!</strong> El motivo de la incidencia no puede estar vacío.</div>" + 
            "</div>");
    } else {
        localStorage.setItem("incidence", $("#incidenceText").val());
        localStorage.setItem("serviceId", getServiceById(id));

        $("#trasanoModalBody").empty();
        $("#trasanoModalFooter").empty();

        $("#trasanoModalBody").append(
            "<div class='progress' id='probar'>" +
                "<div class='progress-bar progress-bar-striped active' " + 
                    "role='progressbar' aria-valuenow='45' aria-valuemin='0' aria-valuemax='100' style='width: 0%'>" +
                        "<span class='sr-only'></span>" + 
                    "</div>" +
                "</div>");

        $("#trasanoModalFooter").append(
            "<button type='button' class='btn btn-danger pull-right' data-dismiss='modal'>CANCELAR</button>");

        $(".progress-bar").animate({
            width: "100%"
        }, 1500);
        
        setTimeout(setIncidence, 2000);
    }
}
/* 
 * Expects: service position of json stored in local storage
 * Returns: Show progress bar if textarea is not empty and execute -> setIncidence (Web Service call)
 */
function executeStatus(id) {
    localStorage.setItem("statusId", $("#statusSelected").val());
    localStorage.setItem("serviceId", getServiceById(id));

    $("#trasanoModalBody").empty();
    $("#trasanoModalFooter").empty();

    $("#trasanoModalBody").append(
        "<div class='progress' id='probar'>" +
            "<div class='progress-bar progress-bar-striped active' " + 
                "role='progressbar' aria-valuenow='45' aria-valuemin='0' aria-valuemax='100' style='width: 0%'>" +
                    "<span class='sr-only'></span>" + 
                "</div>" +
            "</div>");

    $("#trasanoModalFooter").append(
        "<button type='button' class='btn btn-danger pull-right' data-dismiss='modal'>CANCELAR</button>");

    $(".progress-bar").animate({
        width: "100%"
    }, 1500);
    
    setTimeout(setStatus, 2000);
}
/* 
 * Expects: void
 * Returns: Show trasano modal for error
 */
function showMapModal(lat, lng) {
    $("#mapModalHeader").empty();
    $("#mapModalFooter").empty();

    $("#mapModalHeader").append("<h4>Domicilio del paciente</h4>");

    var latitude = parseFloat(lat);
    var longitude = parseFloat(lng);

    // Google Maps operations
    var mapOptions = {
        center: new google.maps.LatLng(latitude, longitude),
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    var map = new google.maps.Map(document.getElementById("map"),
    mapOptions);

    var marker = new google.maps.Marker({
        position: {lat: latitude, lng: longitude},
        map: map,
        title: 'Domicilio del paciente.'
    });

    // Resize map to show on a Bootstrap's modal
    $('#mapModal').on('shown.bs.modal', function() {
        var currentCenter = map.getCenter();  // Get current center before resizing
        google.maps.event.trigger(map, "resize");
        map.setCenter(currentCenter); // Re-set previous center
    });

    // End.Google Maps operations

    $("#mapModalFooter").append("<button type='button' class='btn btn-primary pull-right' data-dismiss='modal'>" + 
    "CERRAR</button>");

    $('#mapModal').modal('show'); 
}
/*************************************************************************************************************
* GOOGLE MAPS functions
**************************************************************************************************************/
/* 
 * Expects: map variable
 * Returns: set on map the position of given latitude and longitude
 */
function setMap(map, lat, lng) {
    geocoder = new google.maps.Geocoder();
    var latlng = new google.maps.LatLng(lat, lng);
    var mapOptions = {
      zoom: 8,
      center: latlng
    }
    map = new google.maps.Map(document.getElementById("map"), mapOptions);
}
/* 
 * Expects: address and map
 * Returns: Latitude and longitude of address given
 */
function codeAddress(address, map) {
    geocoder.geocode( { 'address': address}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        map.setCenter(results[0].geometry.location);
        var marker = new google.maps.Marker({
            map: map,
            position: results[0].geometry.location
        });
      } else {
        console.log("Geocode was not successful for the following reason: " + status);
      }
    });
}
/*************************************************************************************************************
* TRASANO-WS CALLS for TRASANO-DRIVER
**************************************************************************************************************/
/* 
 * Expects: Driver number and ambulance number
 * Returns: Driver name and surname
 */
function registerDriver() {
    var numDriver = $("#numDriver").val();

    $("#trasanoModalHeader").empty();
    $("#trasanoModalBody").empty();
    $("#trasanoModalFooter").empty();

    $("#trasanoModalHeader").append("<h4>Registrar conductor...</h4>");

    if ($.isNumeric($("#numDriver").val()) && $.isNumeric($("#numAmbulance").val())) {
        if (checkDriver($("#numDriver").val(), $("#numAmbulance").val())) {
            console.log("RegisterDriver: Driver is alredy stored: " + numDriver);

            $("#trasanoModalBody").append("<div class='alert alert-warning' role='alert'>" + 
                "<span class='glyphicon glyphicon-info-sign' aria-hidden='true'></span> " + 
                "<strong>Aviso!</strong> El conductor ya está registrado.</div>");

            $("#trasanoModalFooter").append("<button type='button' class='btn btn-primary pull-right' data-dismiss='modal'>" + 
                "CERRAR</button>");

            $('#trasanoMODAL').modal('show'); 
            
        } else {
            $.ajax({
                type: "post",
                dataType: "json",
                contenType: "charset=utf-8",
                data: {numDriver: numDriver, numAmbulance: $("#numAmbulance").val()},
                url: "http://trasano.org:8080/driver/login",
                error: function (jqXHR, textStatus, errorThrown){
                    console.log("RegisterDriver.Error: " + textStatus +  ", throws: " + errorThrown);

                    showErrorModal();
                    showService(-1);
                },
                success: function(data) {
                    if (data.error.length === 0) {
                        console.log("LOGIN of driver: " + data.surname + ", " + data.name + ". " + $("#numDriver").val());
                        
                        localStorage.clear();
                        localStorage.setItem("numDriver", $("#numDriver").val());
                        localStorage.setItem("numAmbulance", $("#numAmbulance").val());
                        localStorage.setItem("name", data.name);
                        localStorage.setItem("surname", data.surname);
                        localStorage.setItem("jsonServices", 0);

                        $("#trasanoModalBody").append("<div class='alert alert-success' role='alert'>" + 
                                "<p><span class='glyphicon glyphicon-thumbs-up' aria-hidden='true'></span> <strong>Conductor registrado!</strong></p> " + 
                            "</div>" + 
                            "<div class='alert alert-info' role='alert'>" +  
                                "<p><span class='glyphicon glyphicon-ok' aria-hidden='true'></span> Conductor: " + numDriver + "</p>" +
                                "<p><span class='glyphicon glyphicon-ok' aria-hidden='true'></span> Ambulancia: " + $("#numAmbulance").val() + "</p>" +
                            "</div>");

                        $("#trasanoModalFooter").append(
                            "<a class='btn btn-primary pull-right' href='javascript:closeTrasanoModal();' role='button'>CERRAR</a>");

                        $('#trasanoMODAL').modal('show');   
                    } else {
                        showErrorModal(error);
                        showService(-1);
                    }
                }
            });
        }

    } else {
        var messageAlert = "";
        if (!$.isNumeric($("#numDriver").val())) {
            messageAlert = "<p><span class='glyphicon glyphicon-remove' aria-hidden='true'></span> Número de conductor incorrecto.</p>"
        }
        if (!$.isNumeric($("#numAmbulance").val())) {
            if (messageAlert.length === 0) {
                   messageAlert = "<p><span class='glyphicon glyphicon-remove' aria-hidden='true'></span> Número de ambulancia incorrecto.</p>";
            } else {
                messageAlert = messageAlert + " <p><span class='glyphicon glyphicon-remove' aria-hidden='true'></span> " + 
                    "Número de ambulancia incorrecto.</p>";
            }
        }
        $("#trasanoModalBody").append("<div class='alert alert-danger' role='alert'>" + 
            "<p><span class='glyphicon glyphicon-alert' aria-hidden='true'></span> <strong>Error!</strong></p>" + 
                messageAlert + "</div>");

        $("#trasanoModalFooter").append("<button type='button' class='btn btn-primary pull-right' data-dismiss='modal'>" + 
            "CERRAR</button>");

        $('#trasanoMODAL').modal('show'); 
    }                         
}
/* 
 * Expects: Driver number and ambulance number.
 * Returns: Services for this ambulance.
 */
function getServices() {
    $("#trasanoModalHeader").empty();
    $("#trasanoModalBody").empty();
    $("#trasanoModalFooter").empty();
    $("#trasanoModalHeader").append("<h4>Servicio de ambulancia</h4>");

    if (isDriverRegistered()) {
        $.ajax({
            type: "post",
            dataType: "json",
            contenType: "charset=utf-8",
            data: {numDriver: localStorage.getItem("numDriver"), numAmbulance: localStorage.getItem("numAmbulance")},
            url: "http://trasano.org:8080/driver/service",
            error: function (jqXHR, textStatus, errorThrown){
                console.log("getServices.Error: " + textStatus +  ", throws: " + errorThrown);
                showErrorModal();
                showService(-1);
            },
            success: function(data) {
                var jsonData = JSON.stringify(data);
                var services = JSON.parse(jsonData);
                var error = services[0].error;
                if (error.length === 0) {
                    console.log("Services of numDriver: " + localStorage.getItem("numDriver") + 
                        ", Ambulance;" + localStorage.getItem("numAmbulance"));
                    localStorage.setItem("jsonServices", jsonData);
                    showService(0);
                } else {
                    showErrorModal(error);
                    showService(-1);
                }
            }
        });
    } else {
        window.location = "pages/login.html";
    }                      
}
/* 
 * Expects: Driver number and ambulance number.
 * Returns: Services for this ambulance.
 */
 function setIncidence() {
    $("#trasanoModalHeader").empty();
    $("#trasanoModalBody").empty();
    $("#trasanoModalFooter").empty();

    $("#trasanoModalHeader").append("<h4>Registrar incidencia</h4>");
    var serviceId = localStorage.getItem("serviceId");

    if (isDriverRegistered()) {
        $.ajax({
            type: "post",
            dataType: "json",
            contenType: "charset=utf-8",
            data: {numDriver: localStorage.getItem("numDriver"), numAmbulance: localStorage.getItem("numAmbulance"), serviceId: serviceId, incidence: localStorage.getItem("incidence")},
            url: "http://trasano.org:8080/driver/incidence",
            error: function (jqXHR, textStatus, errorThrown){
                console.log("setIncidence.Error: " + textStatus +  ", throws: " + errorThrown);
                showErrorModal();
            },
            success: function(data) {
                if (data.error.length === 0) {
                    localStorage.removeItem("incidence");
                    localStorage.removeItem("serviceId");
                    $("#trasanoModalBody").append(
                        "<div class='alert alert-success' role='alert'>" + 
                            "<p><span class='glyphicon glyphicon-ok' aria-hidden='true'></span> Incidencia registrada</p> " + 
                        "</div>");

                    $("#trasanoModalFooter").append(
                        "<a class='btn btn btn-primary' href='javascript:closeModalAndReload();' role='button'>CERRAR</a>");

                    $('#trasanoMODAL').modal('show'); 
                } else {
                    showErrorModal(data.error);
                }
            }
        });
    } else {
        window.location = "pages/login.html";
    }                      
}
/* 
 * Expects: Driver number and ambulance number.
 * Returns: Services for this ambulance.
 */
function setStatus() {
    $("#trasanoModalHeader").empty();
    $("#trasanoModalBody").empty();
    $("#trasanoModalFooter").empty();

    $("#trasanoModalHeader").append("<h4>Estado del servicio</h4>");

    if (isDriverRegistered()) {
        $.ajax({
            type: "post",
            dataType: "json",
            contenType: "charset=utf-8",
            data: {numDriver: localStorage.getItem("numDriver"), numAmbulance: localStorage.getItem("numAmbulance"), 
                serviceId: localStorage.getItem("serviceId"), statusId: localStorage.getItem("statusId")},
            url: "http://trasano.org:8080/driver/status",
            error: function (jqXHR, textStatus, errorThrown){
                console.log("setStatus.Error: " + textStatus +  ", throws: " + errorThrown);
                showErrorModal();
            },
            success: function(data) {
                if (data.error.length === 0) {
                    localStorage.removeItem("serviceId");
                    localStorage.removeItem("statusSelected");

                    $("#trasanoModalBody").append(
                        "<div class='alert alert-success' role='alert'>" + 
                            "<p><span class='glyphicon glyphicon-ok' aria-hidden='true'></span> Estado modificado</p> " + 
                        "</div>");

                    $("#trasanoModalFooter").append(
                        "<a class='btn btn btn-primary' href='javascript:closeModalAndReload();' role='button'>CERRAR</a>");

                    $('#trasanoMODAL').modal('show'); 
                } else {
                    showErrorModal(data.error);
                }
            }
        });
    } else {
        window.location = "pages/login.html";
    }                      
}