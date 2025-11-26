'use client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, HardHat, Printer } from "lucide-react";
import Link from "next/link";

const whatsappNumber = "5531982190935"; // Seu número de WhatsApp

const getWhatsAppLink = (serviceTitle: string) => {
  const message = `Olá! Gostaria de um orçamento para o serviço de ${serviceTitle}.`;
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
};

const services = [
  {
    icon: <Printer className="h-10 w-10 text-primary" />,
    title: "Aluguel de Impressoras",
    description: "Soluções de outsourcing de impressão para sua empresa. Reduza custos e aumente a produtividade com nossos equipamentos modernos.",
    features: [
      "Impressoras a laser e jato de tinta",
      "Manutenção e suprimentos inclusos",
      "Contratos flexíveis",
      "Suporte técnico especializado",
    ],
    link: getWhatsAppLink("Aluguel de Impressoras")
  },
  {
    icon: <HardHat className="h-10 w-10 text-primary" />,
    title: "Conserto de Impressoras",
    description: "Sua impressora quebrou? Nossa equipe técnica resolve. Atendemos diversas marcas e modelos com agilidade e peças de qualidade.",
    features: [
      "Orçamento rápido e sem compromisso",
      "Técnicos certificados",
      "Garantia no serviço prestado",
      "Atendimento no local ou em nosso laboratório",
    ],
    link: getWhatsAppLink("Conserto de Impressoras")
  },
];

export default function ServicosPage() {
  return (
    <div className="container max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Nossos Serviços</h1>
        <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
          Além de materiais gráficos, oferecemos soluções completas para o ambiente do seu escritório.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {services.map((service, index) => (
          <Card key={index} className="flex flex-col">
            <CardHeader className="items-center text-center">
              {service.icon}
              <CardTitle className="mt-4 text-2xl">{service.title}</CardTitle>
              <CardDescription>{service.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <ul className="space-y-2 text-sm text-muted-foreground">
                {service.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href={service.link} target="_blank" rel="noopener noreferrer">
                  Solicitar Orçamento
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
