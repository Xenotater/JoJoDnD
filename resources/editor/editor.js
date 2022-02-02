window.jsPDF = window.jspdf.jsPDF;

$(document).ready(function () {
    $("input").on("keyup", function() {
        var val = $(this).width() / $(this).val().length, upper = 12, lower = 8;

        if ($(this).attr("type") == "number") {
            upper = 16;
            lower = 12;
        }

        console.log(val);
        if (val > upper)
            $(this).css("font-size", "24px");
        else if (val < upper && val > lower)
            $(this).css("font-size", "16px");
        else
            $(this).css("font-size", "12px");
    });

    $("#dl-btn").click(function() {
        generatePDF();
    });
});

//PDF generation assisted by https://www.freakyjolly.com/html2canvas-multipage-pdf-tutorial/
function generatePDF() {
    var pdf;
    html2canvas(document.querySelector("#page1")).then(function (canvas) {
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