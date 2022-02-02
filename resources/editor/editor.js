window.jsPDF = window.jspdf.jsPDF;

$(document).ready(function () {
    $("#dl-btn").click(function () {
        generatePDF();
    });
});

//PDF generation assisted by 
function generatePDF() {
    var pdf;
    // window.scrollTo(0,0)
    html2canvas(document.querySelector("#page1")).then(function (canvas) {
        // document.body.appendChild(canvas)
        var imgData = canvas.toDataURL("/image/png", 1.0);
        pdf = new jsPDF('p', 'in', 'letter');
        pdf.addImage(imgData, 'PNG', 0, 0, 8.5, 11);
        console.log(imgData);
    });
    html2canvas(document.querySelector("#page2")).then(function (canvas) {
        var imgData = canvas.toDataURL("/image/png", 1.0);
        pdf.addPage('letter');
        pdf.addImage(imgData, 'PNG', 0, 0, 8.5, 11);
    });
    html2canvas(document.querySelector("#page3")).then(function (canvas) {
        var imgData = canvas.toDataURL("/image/png", 1.0);
        pdf.addPage('letter');
        pdf.addImage(imgData, 'PNG', 0, 0, 8.5, 11);

        setTimeout(function() {
            pdf.save("JoJo-Character-Sheet.pdf");
            var dl = "<a id='hidden-dl' href='JoJo-Character-Sheet.pdf' download>";
            $("body").append(dl);
            $("#hidden-dl").click();
            $("#hidden-dl").remove();
        }, 0);
    });
}