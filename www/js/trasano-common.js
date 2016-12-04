/*************************************************************************************************************
*
* Project: Trasano
* author: @rvallinot 
*
**************************************************************************************************************/

/*************************************************************************************************************
* DNI functions
**************************************************************************************************************/
/* 
 * Expects: void
 * Returns: Letter of DNI number
 */
function getDNILetter () { 
    dniLetter ="TRWAGMYFPDXBNJZSQVHLCKET"; 
    position = $("#dniNumber").val() % 23;                        
    return dniLetter.substring(position, position+1);                        
}
/* 
 * Expects: DNI number
 * Returns: Letter of DNI number
 */
function getDNILetterByParameter (dni) { 
    dniLetter ="TRWAGMYFPDXBNJZSQVHLCKET"; 
    position = dni % 23;                        
    return dniLetter.substring(position, position+1);                        
}
/*************************************************************************************************************
* TAG functions
**************************************************************************************************************/
/* 
 * Expects: String
 * Returns: Tag Code
 */
function getTagCode (tagcode) {
    position = tagcode.trim().indexOf(".");                       
    return tagcode.trim().substring(position+1, tagcode.length);                        
}
/*************************************************************************************************************
* SERVICE_TIME functions
**************************************************************************************************************/
/* 
 * Expects: void
 * Returns: Service time from local storage ordered by the patient
 */
function getServiceTime () {
    var serviceTime = new Date();
    serviceTime.setTime(parseInt(localStorage.getItem("serviceTime")));
    return serviceTime; 
}
/*************************************************************************************************************
* PATIENT functions
**************************************************************************************************************/
/* 
 * Expects: dni and numss
 * Returns: If the parameters given are equals than the values stored in local storage return true
 */
function checkPatient (dni, numss) {
    return (dni === localStorage.getItem("dni") && numss === localStorage.getItem("numss")); 
}
/*************************************************************************************************************
* AMBULANCE functions
**************************************************************************************************************/
/* 
 * Expects: void
 * Returns: If an ambulance was ordered returns true.
 */
function isAmbulanceOrdered() {
    return (localStorage.getItem("serviceTime") != null && localStorage.getItem("serviceTime") != "");
}
/* 
 * Expects: void
 * Returns: If an ambulance was ordered more than 6 hours ago -> delete serviceTime, tagcode and ambulance data.
 * Deadline for a service is 6 hours. Source: resources/config.js
 */
function checkAmbulanceServiceTime() {
    var deadLine = trasanoOptions.deadLine;

    if (localStorage.getItem("serviceTime") != null && localStorage.getItem("serviceTime") != "") {
        var serviceTime = new Date();
        var currentTime = new Date();

        serviceTime.setTime(parseInt(localStorage.getItem("serviceTime")) + parseInt(deadLine));
        if (currentTime > serviceTime) {
            console.log("trasano.checkAmbulanceServiceTime.localStorage => Inizialiced");
            localStorage.removeItem("ambulance");
            localStorage.removeItem("tagcode");
            localStorage.removeItem("serviceTime");
            localStorage.removeItem("lastClaim");
        }
    } 
}
/* 
 * Expects: void
 * Returns: Show ambulance information from local storage
 */
function showAmbulanceInfo() {
    var ambulance = JSON.parse(localStorage.getItem("ambulance"));
    $("#trasanoModalHeader").empty();
    $("#trasanoModalBody").empty();
    $("#trasanoModalFooter").empty();

    $("#trasanoModalHeader").append(
            "<h4>Datos de la ambulancia</h4>"
        );

    if (ambulance.numAmbulance <= 0) {
        $("#trasanoModalBody").append(
            "<div class='alert alert-info' role='alert'>" + 
                "<p><span class='glyphicon glyphicon-info-sign' aria-hidden='true'></span> " + 
                "<strong>Aviso!</strong> Servicio de ambulancia pendiente de asignar.</p>" +
            "</div>" + 
            "<div class='alert alert-warning' role='alert'>" + 
                "<p><span class='glyphicon glyphicon-info-sign' aria-hidden='true'></span> " + 
                "Reclamaciones del servicio: <span class='badge'>" + ambulance.numClaim + "</span></p>" + 
            "</div>"
        );  
    } else {
      $("#trasanoModalBody").append(
            "<div class='alert alert-success' role='alert'>" + 
                "<p>Número de ambulancia: <strong>" + ambulance.numAmbulance + "</strong></p>" +
                "<p>Conductor: <strong>" + ambulance.driverName + " " + ambulance.driverSurname +  "</strong></p>" +
                "<p>Compañía: <strong>" + ambulance.ambulanceCompany + "</strong></p>" + 
            "</div>" + 
            "<div class='alert alert-warning' role='alert'>" + 
                "<p>Reclamaciones del servicio: <span class='badge'>" + ambulance.numClaim + "</span></p>" + 
            "</div>"
        );  
    }
    
    $("#trasanoModalFooter").append("<button type='button' class='btn btn-primary' data-dismiss='modal'>CERRAR</button>");

    $('#trasanoMODAL').modal('show');
}
/*************************************************************************************************************
* MODAL functions
**************************************************************************************************************/
/* 
 * Expects: void
 * Returns: Show detail of the ambulance service for the patient logged
 */
function showServiceInfo() {
    $("#trasanoModalHeader").empty();
    $("#trasanoModalBody").empty();
    $("#trasanoModalFooter").empty();

    $("#trasanoModalHeader").append(
        "<h4>Información del Servicio</h4>"
    );  

    $("#trasanoModalBody").append(
        "<div class='alert alert-danger' role='alert'>" + 
            "<p><span class='glyphicon glyphicon-warning-sign' aria-hidden='true'></span> " + 
            "<strong>" + localStorage.getItem("name") + "!</strong>" + 
            " No dispone de servicio de ambulancia.</p>" +
        "</div>" + 
        "<div class='alert alert-info' role='alert'>" + 
            "<p><span class='glyphicon glyphicon-info-sign' aria-hidden='true'></span> Consulte en el mostrador para más información.</p>" + 
        "</div>"
    );

    $("#trasanoModalFooter").append("<button type='button' class='btn btn-primary' data-dismiss='modal'>CERRAR</button>");  

    $('#trasanoMODAL').modal('show');
}