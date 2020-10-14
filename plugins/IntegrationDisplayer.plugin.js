//META{"name":"IntegrationDisplayer","displayName":"Integration Displayer","authorId":"265918045069770753", "source":"https://raw.githubusercontent.com/alvesvaren/betterdiscord-things/master/plugins/spotify_toggle.plugin.js","website":"https://github.com/alvesvaren/betterdiscord-things"}*//

class IntegrationDisplayer {
    activityTypes = {
        1: "Join",
        2: "Spectate",
        3: "Listen",
        4: "Join request",
    };

    getName() {
        return "Integration Displayer";
    }
    getShortName() {
        return "Integration Displayer";
    }
    getDescription() {
        return "Displays data associated with messages sent from games and other applications using discord game sdk.";
    }
    getVersion() {
        return "0.0.1";
    }
    getAuthor() {
        return "Alve"; // Current Discord account: @Alve#0001
    }

    constructor() {
        this.selector = ".da-messagesWrapper .da-scrollerInner";
        this.elementClassName = "integration-displayer-element";
        this.processedAttribute = "integration-displayer-processed";
    }

    start() {
        this.onSwitch();
    }

    onSwitch() {
        if (!ZLibrary) {
            console.error("ZLibrary not found, please install it");
            return;
        }
        if (!ZLibrary.DiscordAPI.currentChannel) {
            console.warn("Didn't find any active channel");
            return;
        }
        var messages = ZLibrary.DiscordAPI.currentChannel.messages.filter((msg) => {
            return !!msg.discordObject.activity;
        });

        for (var message of messages) {
            var messageInDom = document.querySelector(this.selector + " #chat-messages-" + message.discordObject.id);
            if (!messageInDom.hasAttribute(this.processedAttribute)) {
                messageInDom.setAttribute(this.processedAttribute, "");
                var activity = message.discordObject.activity;
                if (!activity.party_id) {
                    return;
                }

                var jsonElement = document.createElement("span");

                jsonElement.textContent = `${this.activityTypes[activity.type]}: ${activity.party_id}`;
                jsonElement.classList.add("markup-2BOw-j");
                jsonElement.classList.add(this.elementClassName);
                messageInDom.appendChild(jsonElement);
            }
        }
    }

    // getSettingsPanel() {
    //     let settingsRoot = document.createElement("div");
    //     settingsRoot.appendChild(new ZLibrary.Settings.Textbox("Ignored intergration names (comma separated)", "Example: \"among us, spotify\"").getElement())
    //     return settingsRoot;
    // }

    // onMessage() {
    //     console.log("MESSAGE");
    //     this.onSwitch();
    // }

    observer() {
        this.onSwitch();
    }

    stop() {
        document.querySelectorAll(`[${this.processedAttribute}]`).forEach((element) => element.removeAttribute(this.processedAttribute));
        document.querySelectorAll("." + this.elementClassName).forEach((element) => element.remove());
    }
}
