type AppLogoProps = {
    imageUrl: string;
    name: string;
    role: string;
};

export default function AppLogo({ imageUrl, name, role }: AppLogoProps) {
    return (
        <div className="flex items-center">
            <img
                src={imageUrl}
                alt={name}
                className="aspect-square size-8 rounded-md object-cover"
            />
            <div className="ml-2 flex flex-col text-left">
                <span className="font-semibold leading-tight truncate">{name}</span>
                <span className="text-xs text-gray-500 truncate">{role}</span>
            </div>
        </div>
    );
}
