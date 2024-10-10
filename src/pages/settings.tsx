import { Button, Divider, Switch } from "@mui/material";
import { GetServerSideProps, NextPage } from "next";
import { ChangeEvent, useEffect, useState } from "react";
import Meta from "../components/Meta";
import { useAuth } from "../lib/AuthProvider";
import { Tailwind, useTheme } from "../lib/TailwindProvider";
import { getSettings } from "./api/settings/get";

interface Props {
  settings: {
    darkMode: boolean;
    desktopNotify: boolean;
    mobileNotify: boolean;
    usernameVisibleOnPosts: boolean;
    usernameVisibleOnComments: boolean;
    showPorn: boolean;
    showViolence: boolean;
  };
}

const Settings: NextPage<Props> = ({ settings }) => {
  const [settingsState, setSettingsState] = useState(settings);
  const [successfulVisible, setSuccessfulVisible] = useState(false);
  const { setTheme } = useTheme();
  const { clearAuth } = useAuth();

  const onSettingsChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSuccessfulVisible(false);
    setSettingsState({ ...settingsState, [e.target.name]: e.target.checked });
  };

  useEffect(() => {
    setTheme(settingsState.darkMode ? Tailwind.DARK : Tailwind.LIGHT);
  }, [settingsState.darkMode]);

  const settingsSubmit = () => {
    fetch("/api/settings/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(settingsState),
    }).then((res) => {
      if (res.status === 401 || res.status === 403) {
        clearAuth();
        return;
      }

      if (res.ok) {
        setSuccessfulVisible(true);
        localStorage.setItem(
          "themeMode",
          settingsState.darkMode === true ? "dark" : "false"
        );
      }
    });
  };

  return (
    <>
      <Meta title="oof - Settings" description="Browse the latest posts." />
      <div className="flex flex-col items-center mt-10 dark:text-slate-300">
        <div className="flex flex-col border border-slate-600 dark:border-slate-300 rounded-lg p10 md:w-96">
          <div className="flex flex-row items-center">
            <h2>Dark Mode</h2>
            <Switch
              className="ml-auto"
              name="darkMode"
              checked={settingsState.darkMode}
              onChange={onSettingsChange}
            />
          </div>

          <Divider className="my-2 bg-slate-300 bg-opacity-60" />

          <div className="flex flex-row items-center">
            <h2>Mobile Notifications</h2>
            <Switch
              className="ml-auto"
              name="mobileNotify"
              checked={settingsState.mobileNotify}
              onChange={onSettingsChange}
            />
          </div>

          <Divider className="my-2 bg-slate-300 bg-opacity-60" />

          <div className="flex flex-row items-center">
            <h2>Desktop Notifications</h2>
            <Switch
              className="ml-auto"
              name="desktopNotify"
              checked={settingsState.desktopNotify}
              onChange={onSettingsChange}
            />
          </div>

          <Divider className="my-2 bg-slate-300 bg-opacity-60" />

          <div className="flex flex-col">
            <div className="flex flex-row items-center mb-2">
              <b>Privacy:</b>
            </div>

            <div className="ml-5">
              <div className="flex flex-row">
                <h3>Username visible on posts</h3>
                <Switch
                  className="ml-auto"
                  name="usernameVisibleOnPosts"
                  checked={settingsState.usernameVisibleOnPosts}
                  onChange={onSettingsChange}
                />
              </div>

              <div className="flex flex-row">
                <h3>Username visible on comments</h3>
                <Switch
                  className="ml-auto"
                  checked={settingsState.usernameVisibleOnComments}
                  name="usernameVisibleOnComments"
                  onChange={onSettingsChange}
                />
              </div>
            </div>
          </div>

          <Divider className="my-2 bg-slate-300 bg-opacity-60" />

          <div className="flex flex-col">
            <div className="flex flex-row items-center mb-2">
              <b>NSFW 🔞:</b>
            </div>

            <div className="ml-5">
              <div className="flex flex-row">
                <h3>Show sexual content</h3>
                <Switch
                  className="ml-auto"
                  name="showPorn"
                  checked={settingsState.showPorn}
                  onChange={onSettingsChange}
                />
              </div>

              <div className="flex flex-row">
                <h3>Show violence</h3>
                <Switch
                  className="ml-auto"
                  name="showViolence"
                  checked={settingsState.showViolence}
                  onChange={onSettingsChange}
                />
              </div>
            </div>
          </div>

          <div className="ml-auto mt-5 mb-3  flex flex-row">
            <Button
              color="secondary"
              variant="outlined"
              className="mr-2"
              href="/settings"
            >
              Cancel
            </Button>
            <Button
              color="primary"
              variant="outlined"
              className="mr-2"
              onClick={settingsSubmit}
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const settings = await getSettings({ req, res });
  if (!settings) {
    return {
      props: {
        settings: {
          darkMode: true,
          mobileNotify: true,
          desktopNotify: false,
          usernameVisibleOnPosts: false,
          usernameVisibleOnComments: false,
          showPorn: false,
          showViolence: false,
        },
      },
    };
  }

  return {
    props: {
      settings,
    },
  };
};

export default Settings;
