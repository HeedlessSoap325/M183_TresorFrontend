function ProgressBar({percentage, color, label}: {percentage: number, color: string, label: string}) {
	return (
		<div>
            <div
                style={{
                    height: 8,
                    width: "80%",
                    background: "#e5e7eb",
                    borderRadius: 4,
                    marginTop: 8,
                    overflow: "hidden",
                }}
            >
                <div
                    style={{
                        width: `${percentage}%`,
                        height: "100%",
                        background: color,
                        transition: "width 200ms ease",
                        borderRadius: 4,
                    }}
                />
            </div>

            <p>
                {label} - {percentage}/100
            </p>
        </div>
	);
}

export default ProgressBar;