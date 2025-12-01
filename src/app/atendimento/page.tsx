import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Mail, Phone, MessageSquare } from "lucide-react";
import Link from "next/link";

export default function AtendimentoPage() {
  return (
    <div className="container max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Central de Atendimento</h1>
        <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
          Estamos aqui para ajudar! Encontre respostas para suas dúvidas ou entre em contato conosco.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <Card className="text-center">
          <CardHeader>
            <Phone className="h-10 w-10 mx-auto text-primary mb-2" />
            <CardTitle>Telefone</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Ligue para nós</p>
            <p className="text-lg font-semibold">(31) 98219-0935</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardHeader>
            <Mail className="h-10 w-10 mx-auto text-primary mb-2" />
            <CardTitle>E-mail</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Envie sua dúvida</p>
            <p className="text-lg font-semibold">gráficaouro01@gmail.com</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardHeader>
            <MessageSquare className="h-10 w-10 mx-auto text-primary mb-2" />
            <CardTitle>WhatsApp</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Converse conosco</p>
            <Link href="https://wa.me/5531982190935" target="_blank" className="text-lg font-semibold text-primary hover:underline">
              Iniciar conversa
            </Link>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-3xl font-bold text-center mb-8">Perguntas Frequentes</h2>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>Quais são as formas de pagamento?</AccordionTrigger>
            <AccordionContent>
              Aceitamos cartões de crédito em até 6x, PIX e boleto bancário.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Como envio minha arte?</AccordionTrigger>
            <AccordionContent>
              Após finalizar a compra, nossa equipe entrará em contato por e-mail ou WhatsApp para solicitar o arquivo da sua arte. Certifique-se de que ela esteja em um formato de alta qualidade (PDF, AI, CDR).
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Qual o prazo de produção e entrega?</AccordionTrigger>
            <AccordionContent>
              O prazo de produção varia de acordo com o produto e está especificado na página de cada um. O prazo de entrega começa a contar após o término do prazo de produção e depende da sua localidade.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger>Posso retirar meu pedido pessoalmente?</AccordionTrigger>
            <AccordionContent>
              Sim, oferecemos a opção de retirada em nosso endereço físico. Você pode selecionar essa opção ao finalizar a compra.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
