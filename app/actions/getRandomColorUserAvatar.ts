const hashCode = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
};

const getColorFromHash = (hash: any) => {
    const color = `#${((hash & 0x00ffffff) >>> 0)
        .toString(16)
        .padStart(6, "0")}`;
    return color;
};

export const getInitialsColor = (name: string) => {
    const nameParts = name.split(" ");
    let initials: string = name.charAt(0).toUpperCase();
    const backgroundColor = getColorFromHash(hashCode(name));

    if (nameParts.length < 2) {
        return {
            backgroundColor,
            initials,
        };
    }

    if (nameParts.length > 2) {
        initials = `${nameParts[0].charAt(0)}${nameParts[2].charAt(
            0
        )}`.toUpperCase();
    } else {
        initials = `${nameParts[0].charAt(0)}${nameParts[1].charAt(
            0
        )}`.toUpperCase();
    }

    return {
        backgroundColor,
        initials,
    };
};
