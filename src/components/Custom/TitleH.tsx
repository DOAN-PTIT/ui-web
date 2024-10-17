interface TitleProps {
    title: React.ReactNode;
}

export default function TitleH({ title }: TitleProps) {
    return (
        <div className="text-base font-medium">
            {title}
        </div>
    );
}

