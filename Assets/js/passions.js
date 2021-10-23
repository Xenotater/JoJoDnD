$(document).ready(function () {
    var url = new URL(window.location.href);
    var p = url.searchParams.get("focus");
    // var filterOpen = false;

    if (p == null) {
        p = "Academic";
        window.history.replaceState(null, "", '?focus=' + p);
    }
    updateDisplay(p);

    $(".passion-link").click(function () {
        var p = $(this).html();
        window.history.replaceState(null, "", '?focus=' + p);
        updateDisplay(p.replace(' ', '_'));
    })

    $(".passion-list-link").click(function () {
        var p = $(this).attr("id");
        window.history.replaceState(null, "", '?focus=' + p);
        updateDisplay(p);
    })

    function updateDisplay(passion) {
        var name = passion, desc = "", examples = [], saves = "", saves = "", ability = "", custom = "", other = "";

        switch (passion) {
            default:
                passion = "Academic";
                window.history.replaceState(null, "", '?focus=Academic');
            case "Academic":
                desc = "Academics do exactly as the name suggests. They study hard, or teach hard, using their intelligence and experience to do their jobs.";
                examples = ["Professors", "Accountants", "Teachers", "Programmers", "Scientists/Researchers"];
                saves = "You are proficient in Intelligence and Constitution saving throws.";
                ability = "Your Intelligence score increases by 2.";
                custom = ["Academic Studies", "You have proficiency with Arcana, History, and Investigation."];
                other = ["Languages", "You can speak, read, and write up to two additional human languages."];
                break;
            case "Artist":
                desc = "Using some sort of medium, Artists create beautiful things, made to invoke feelings in people. Whether it be a comic, a painting, or a sculpture, Artists spend hours in seclusion or with other artists, with the sole goal of improving their craft.";
                examples = ["Writers", "Painters", "Sculptors", "Mangakas", "Acrobats", "Dancers", "Chefs"];
                saves = "You are proficient in Dexterity and Intelligence saving throws.";
                ability = "Your Dexterity score increases by 2 and your Intelligence score increases by 1.";
                custom = ["Artist's Soul", "You have proficiency in Sleight of Hand and Performance. You also gain Proficiency in a set of Artisan’s Tools or an instrument of your choice."];
                break;
            case "Athlete":
                desc = "People who push their bodies to the limits, in order to see the true limit of humanity’s potential, and to push past those limits.";
                examples = ["Olympians", "Professional Sports Players", "Warriors/Soldiers"];
                saves = "You are proficient in two of the following saving throws of your choice: Strength, Dexterity, or Constitution.";
                ability = "Your Strength score increases by 2 and your Dexterity score increases by 1.";
                custom = ["Athletic Experience", "You have proficiency in Athletics and Acrobatics."];
                break;
            case "Con_Artist":
                name = "Con Artist";
                desc = "Those who steal, not for survival, but for wealth. To attain power, money, or influence, these people take advantage of the human brain in order to push people to achieve their own goals.";
                examples = ["Lawyers", "Fake Fortune Tellers", "Politicians", "Scammers", "Cult Leaders"];
                saves = "You are proficient in Charisma and Intelligence saving throws.";
                ability = "Your Charisma score increases by 2.";
                custom = ["Award-Winning Smile", "You have proficiency in Deception, Persuasion, Intimidation, and Religion."];
                other = ["Languages", "You can speak, read, and write up to three human languages."];
                break;
            case "Hard_Laborer":
                name = "Hard Laborer";
                desc = "Some make a living performing unpleasant jobs that are physically demanding. Without them, society would not function.";
                examples = ["Construction Workers", "Garbage Collectors", "Coal Miners"];
                saves = "You are proficient in Constitution and Dexterity saving throws.";
                ability = "Your Constitution score increases by 2 and your Dexterity and Strength scores increase by 1.";
                custom = ["Grit", "You may choose to be proficient in two of the following: Athletics, Acrobatics, Animal Handling, or Intimidation."];
                break;
            case "Performer":
                desc = "Those who perfect a craft in order to inspire, but also to hear the roar of the crowd.";
                examples = ["Stand Up Comedians", "Actors", "Musicians", "DJs"];
                saves = "You are proficient in Charisma and Constitution saving throws.";
                ability = "Your Charisma score increases by 2 and your Constitution score increases by 1.";
                custom = ["Crowd Pleaser", "You have proficiency in Deception, Persuasion, and of course, Performance. You are also proficient in up to two instruments of your choice."];
                break;
            case "Physician":
                desc = "Physicians use their superior intellect, reasoning, and patience to assist the injured. Physicians have immense knowledge of the Human Body, knowing how it works in almost every way.";
                examples = ["Doctors", "Nurses", "Surgeons", "EMT Operators", "Veterinarians"];
                saves = "You are proficient in Intelligence and Wisdom saving throws.";
                ability = "Your Intelligence score increases by 2 and your Wisdom score increases by 1.";
                custom = ["Medical Experience", "You have proficiency in Animal Handling, and expertise in Medicine."];
                break;
            case "Service_Worker":
                name = "Service Worker";
                desc = "A person who makes their living serving people, using their training and wit to help them.";
                examples = ["Waiters/Waitresses", "Receptionists", "Secretaries", "Salespeople"];
                saves = "You are proficient in Wisdom and Charisma saving throws.";
                ability = "Your Wisdom score increases by 1 and your Charisma score increases by 1.";
                custom = ["People Person", "You have proficiency in Insight, Perception, and Persuasion."];
                other = ["Languages", "You can speak, read, and write up to two human languages."]
                break;
            case "Student":
                desc = "Many people have no clue what they would like, and simply want to reach their feelers as wide as they can.";
                examples = ["High School Students", "College Students"];
                saves = "You are proficient in any two saving throws of your choice.";
                ability = "You get +2 to one stat of your choice, +1 to three stats of your choice, and -1 to two stats of your choice.";
                custom = ["Constant Improvement", "You have proficiency in any three skills of your choice."];
                other = ["Languages", "You can speak, read, and write up to two human languages."]
                break;
            case "Survivalist":
                desc = "A person who has chosen to forgo most parts of Modern Society, instead cultivating their own land, and living a simple, more reclusive life. Survivalists might also be those attempting to make their way in a harsh Urban Climate.";
                examples = ["Wilderness Survivors", "Rural Subsistence Farmers", "Hunters", "Gangsters", "Monks"];
                saves = "You are proficient in Constitution and Wisdom saving throws.";
                ability = "Your Wisdom score increases by 2 and your Constitution score increases by 1.";
                custom = ["Will to Thrive", "You have proficiency in Insight, Perception, Animal Handling, and Survival. You also gain proficiency in the use of the Herbalism Kit."];
                break;
            case "Thief":
                desc = "Those who must make a living taking from the more fortunate. Through Stealth, Intimidation, or Speed, Thieves take to sustain the needs of themselves or those they hold close.";
                examples = ["Robbers", "Muggers"];
                saves = "You are proficient in Dexterity and Charisma saving throws.";
                ability = "Your Dexterity score increases by 2 and your Charisma score increases by 1.";
                custom = ["Street Smarts", "You have proficiency in Sleight of Hand, Stealth, and Intimidation. You also gain proficiency in Thieves' Tools."];
                break;
            case "Trained_Laborer":
                name = "Trained Laborer";
                desc = "Someone who has studied for years in order to hone their craft. They use their Strength along with their experience in order to accomplish their tasks.";
                examples = ["Mechanics", "Blacksmiths / Metal Workers"];
                saves = "You are proficient in Strength and Intelligence saving throws.";
                ability = "Your Strength score increases by 2 and your Intelligence score increases by 1.";
                custom = ["Labor Experience", "You have proficiency in Athletics, Arcana and Investigation. You also gain proficiency in a set of Artisan’s Tools of your choice."];
                break;
            case "Traveler":
                desc = "Those who travel immense distances, using their superior willpower and trained body to withstand immense pressure over long periods of time.";
                examples = ["Triathletes", "(Most) Ripple Users"];
                saves = "You are proficient in Wisdom and Constitution saving throws.";
                ability = "Your Constitution score increases by 3 and your Wisdom score increases by 1.";
                custom = ["Trial and Error", "You have proficiency in Survival and Religion."];
                break;
        }
        $(".listCurrent").removeClass("listCurrent");
        $("#" + passion).addClass("listCurrent");
        display(name, desc, examples, saves, ability, custom, other);
    }

    function display(name, desc, examples, saves, ability, custom, other) {
        box1 = $("#box1");
        box2 = $("#box2");
        box1.html("<h2 class='passion-title'>" + name + "</h2>");
        box1.append("<p>" + desc + "</p>");
        box1.append("<h5 class='passion-heading'>Examples</h4>")
        box1.append("<ul id='example-list'>");
        for (let i = 0; i < examples.length; i++) {
            $("#example-list").append("<li>" + examples[i] + "</li>");
        }
        box2.html("<h3 class='passion-title'>" + name + " Traits</h3>");
        box2.append("<p><span class='bold italic'>Saving Throws:</span> " + saves);
        box2.append("<p><span class='bold italic'>Ability Score Increase:</span> " + ability);
        box2.append("<p><span class='bold italic'>" + custom[0] + ":</span> " + custom[1]);
        if (other != "") box2.append("<p><span class='bold italic'>" + other[0] + ":</span> " + other[1])
    }

    //all below wasn't needed for few number of passions, but may be for other pages
    // $("#search").focusin(function () {
    //     $(this).css("box-shadow", "0 0 20px purple");
    // })

    // $("#search").focusout(function () {
    //     $(this).css("box-shadow", "none");
    // })

    // $("#filter").click(function() {
    //     var that = "#filters";
    //     if (filterOpen) {
    //         $(this).css("box-shadow", "none");
    //         $("#list").animate({
    //             height: "500px"
    //         }, 400)
    //         $(that).animate({
    //             height: "0",
    //             paddingTop: "0",
    //             paddingBottom: "0"
    //         }, 400, function() {
    //             $(that).css("border-bottom", "none");
    //             $(that).html("");
    //         })
    //         filterOpen = false;
    //     }
    //     else {
    //         $(this).css("box-shadow", "0 0 20px purple");
    //         $(that).css("border-bottom", "2px solid purple");

    //         $(that).append("<span class='underline bold'>Abilities</span><span>: </span><button class='filter-item' id='str'>Str</button>");
    //         $(that).append("<button class='filter-item' id='dex'>Dex</button><button class='filter-item' id='con'>Con</button><button class='filter-item' id='int'>Int</button>");
    //         $(that).append("<button class='filter-item' id='wis'>Wis</button><button class='filter-item' id='cha'>Cha</button>");

    //         $("#list").animate({
    //             height: "450px"
    //         }, 400)
    //         $(that).animate({
    //             height: "50px",
    //             paddingTop: "7px",
    //             paddingBottom: "7px"
    //         }, 400)
    //         filterOpen = true;
    // //     }
    // // })

    // $("#reset").click(function() {
    //     $(this).css("box-shadow", "0 0 20px purple");
    //     var timeout = setTimeout(function() {
    //         $("#reset").css("box-shadow", "none");
    //     }, 1000);
    // })
});