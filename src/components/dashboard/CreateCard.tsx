import LinkButton from '@/components/ui/LinkButton'
import PlusIcon from '@/components/ui/svg/dashboard/PlusIcon'
import LinkText from '@/components/ui/LinkText'

const CreateCard = ({ title, description, buttonText, buttonLink, linkText, linkUrl }:
{ title: string, description: string | JSX.Element, buttonText: string, buttonLink: string, linkText: string, linkUrl: string }) => (
    <div className="bg-white shadow-lg rounded-lg p-6">
        <h3 className="text-3xl font-semibold mb-2 text-Dark flex justify-center">{title}</h3>
        <div className="text-gray-600 mb-4 text-Black">{description}</div>
        <div className="flex justify-center">
            <LinkButton href={buttonLink} buttonText={buttonText} symbol={<PlusIcon/>} />
        </div>
        <LinkText href={linkUrl} buttonText={linkText} />
    </div>
)

export default CreateCard
