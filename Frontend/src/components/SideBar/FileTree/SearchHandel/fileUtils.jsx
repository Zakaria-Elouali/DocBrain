export const searchFiles = (files, searchTerm) => {
    return files.filter((file) => {
        const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
        if (file.children) {
            const matchingChildren = searchFiles(file.children, searchTerm);
            return matchesSearch || matchingChildren.length > 0;
        }
        return matchesSearch;
    });
};
