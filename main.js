$(document).ready(function() {
  loadSocialData();
});

function loadSocialData() {
  $.get("https://discordapp.com/api/v7/invite/nmgSjPW8xs?with_counts=true", function(resp) {
    $("#discordEmbed .socialMembers").html(`${resp.approximate_member_count} Members, ${resp.approximate_presence_count} Online`);
    $("#discordEmbed .socialName").html(resp.guild.name);
    $("#discordEmbed .socialIcon").attr("src", `https://cdn.discordapp.com/icons/${resp.guild_id}/${resp.guild.icon}.gif`)
  });
  $.get("https://www.reddit.com/r/jojodnd/about.json", function(resp) {
    $("#redditEmbed .socialMembers").html(`${resp.data.subscribers} Members, ${resp.data.active_user_count} Online`);
    $("#redditEmbed .socialName").html(resp.data.display_name_prefixed);
    $("#redditEmbed .socialIcon").attr("src", resp.data.community_icon.replace(/\?.*/, ""));
  })
}