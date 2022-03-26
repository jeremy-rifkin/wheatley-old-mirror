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
	with open(path, "r") as f:
		lines = ["/**/" for _ in f]
	lines = emplace_over(redacted_message, lines)
	with open(path, "w") as f:
		f.write("\n".join(lines) + "\n")
	print(f"cleansed {path}")

def main():
	for file in [
		"anti_raid.ts",
		"anti_scambot.ts",
		"hic_sunt_dracones.ts",
		"link_blacklist.ts",
		"raidpurge.ts"
	]:
		cleanse(f"src/{file}")

main()
