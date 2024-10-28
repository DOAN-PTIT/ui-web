import clsx from 'clsx'; // Cài đặt với `npm install clsx` hoặc `yarn add clsx`

interface TitleProps {
    title: React.ReactNode;
    className?: string; // Cho phép truyền className từ ngoài vào
}

export default function TitleH({ title, className }: TitleProps) {
    return (
        <div className={clsx("font-medium", className)}>
            {title}
        </div>
    );
}
