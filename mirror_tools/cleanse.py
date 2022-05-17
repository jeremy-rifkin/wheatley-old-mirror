import os

redacted_message = \
"""
/****************************************************
 * This file's contents have been stripped from the *
 * public mirror due to its sensitive nature. In    *
 * this repository files are considered sensitive   *
 * if they contain logic related to detection and   *
 * handling of scammers, spammers, and bots.        *
 ***************************************************/
""".strip().split("\n") + [""]

def emplace_over(a, b):
    return a + b[len(a):]

def cleanse(path):
    if os.path.exists(path):
        with open(path, "r") as f:
            lines = ["/**/" for _ in f]
        lines = emplace_over(redacted_message, lines)
        with open(path, "w") as f:
            f.write("\n".join(lines) + "\n")
        print(f"cleansed {path}")
    else:
        print(f"Couldn't find {path}")

def main():
    for file in [
        "anti_raid.ts",
        "anti_scambot.ts",
        "config.ts",
        "hic_sunt_dracones.ts",
        "link_blacklist.ts",
        "message_purge.ts"
        "pasta.ts",
        "raidpurge.ts",
        "test_module.ts",
    ]:
        cleanse(f"src/{file}")

main()
