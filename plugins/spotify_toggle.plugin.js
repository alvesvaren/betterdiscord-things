//META{"name":"SpotifyConnectionToggle","displayName":"SpotifyConnectionToggle","authorId":"265918045069770753", "source":"https://raw.githubusercontent.com/alvesvaren/betterdiscord-things/master/plugins/spotify_toggle.plugin.js","website":"https://github.com/alvesvaren/betterdiscord-things"}*//

class SpotifyConnectionToggle {
    getName() {
        return "Spotify Connection Toggler";
    }
    getShortName() {
        return "Spotify Status Toggle";
    }
    getDescription() {
        return "Allows you to toggle between showing and not showing your current spotify track in your profile status";
    }
    getVersion() {
        return "0.0.2";
    }
    getAuthor() {
        return "Alve"; // Current Discord account: @Alve#0001
    }

    constructor() {
        this.selector = ".da-sidebar > section.da-panels";
        this.section = document.querySelector(this.selector);
        this.start = this.start.bind(this);
        this.toggleSwitch = null;
        this.shouldStop = false;
        this.injectedStyle = null;
    }

    start() {
        this.getConnectionData.bind(this)(this.appendSwitch);
    }

    appendSwitch() {
        this.injectedStyle = document.createElement("style");
        this.injectedStyle.innerHTML = `${this.selector} > .plugin-input-container > .da-flex {
            margin-bottom: 0px; 
            padding-left: 8px; 
            padding-right: 8px; 
            height: 32px; 
            padding-top: 8px;
        }`;

        if (!this.shouldStop) {
            document.head.appendChild(this.injectedStyle);
            this.section.appendChild(this.toggleSwitch.getElement());
        }
    }

    setSwitch(active) {
        this.toggleSwitch.value = active;
    }

    async handleToggle(toggled) {
        await ZLibrary.DiscordModules.APIModule.patch({
            url: "/users/@me/connections/spotify/evla2003",
            body: { show_activity: toggled },
        });
    }

    async getConnectionData(whenDone) {
        const connectionsResponse = await ZLibrary.DiscordModules.APIModule.get(
            "/users/@me/connections"
        );
        const spotifyConnection = connectionsResponse.body.find(
            (e) => e.type === "spotify"
        );
        const shouldShow = spotifyConnection.show_activity;
        this.username = spotifyConnection.id;

        this.toggleSwitch = new ZLibrary.Settings.Switch(
            "Show spotify as status",
            null,
            shouldShow,
            this.handleToggle
        );

        this.toggleSwitch.getElement().style =
            "background-color: var(--background-tertiary); flex-shrink: 0;";
        whenDone.bind(this)();
    }

    stop() {
        this.shouldStop = true;
        if (this.toggleSwitch) {
            this.toggleSwitch.getElement().remove();
            this.injectedStyle.remove();
        }
    }
}
