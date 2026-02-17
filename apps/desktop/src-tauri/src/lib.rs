#[tauri::command]
fn set_traffic_lights_visible(
    window: tauri::WebviewWindow,
    visible: bool,
) -> Result<(), String> {
    #[cfg(target_os = "macos")]
    {
        use objc2_app_kit::{NSWindow, NSWindowButton};

        let ptr = window.ns_window().map_err(|e| e.to_string())?;
        let ns_win: &NSWindow = unsafe { &*(ptr as *const NSWindow) };

        let buttons = [
            NSWindowButton::CloseButton,
            NSWindowButton::MiniaturizeButton,
            NSWindowButton::ZoomButton,
        ];

        for button in buttons {
            if let Some(btn) = ns_win.standardWindowButton(button) {
                btn.setHidden(!visible);
            }
        }
    }

    let _ = (window, visible);
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_sql::Builder::new().build())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![set_traffic_lights_visible])
        .setup(|_app| {
            #[cfg(debug_assertions)]
            {
                use tauri::Manager;
                let window = _app.get_webview_window("main").unwrap();
                window.open_devtools();
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running ZunftGewerk desktop application");
}
