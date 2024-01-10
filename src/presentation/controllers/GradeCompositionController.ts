import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  ParseArrayPipe,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiHeaders,
  ApiOperation,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { SuccessResponseDTO } from 'application/dtos/SuccessResponseDTO';
import { GradeCompositionUseCase } from 'application/usecases/GradeCompositionUseCase';
import { RequestWithUser } from 'infrastructure/guards/JwtStrategy';
import { TeacherRoleGuard } from 'infrastructure/guards/TeacherRoleGuard';
import { SuccessInterceptor } from 'infrastructure/interceptor/success.interceptor';
import { BadRequestError } from 'presentation/errors/BadRequestError';
import { UnprocessableEntityError } from 'presentation/errors/UnprocessableEntityError';
import { UpsertGradeCompositionVM } from 'presentation/view-model/gradecompositions/CreateGradeCompositionVM';
import { GradeCompositionVM } from 'presentation/view-model/gradecompositions/GradeCompositionVM';

@ApiBearerAuth()
@ApiTags('GradeComposition')
@Controller('api/v1/grade-composition')
@UseGuards(AuthGuard('jwt'))
@UseInterceptors(SuccessInterceptor)
export class GradeCompositionController {
  constructor(
    private readonly gradeCompositionUseCase: GradeCompositionUseCase,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Gets grade composition',
  })
  async showGradeComposition(
    @Headers('class-id') currentClassId: number,
    @Request() req: RequestWithUser,
  ) {
    const gradeCompositions =
      await this.gradeCompositionUseCase.showGradeComposition(
        parseInt(currentClassId.toString()),
        req.user.userId,
      );

    console.log(gradeCompositions);

    return new SuccessResponseDTO({
      message: 'Grade composition founded',
      metadata: gradeCompositions.map((gradeComposition) =>
        GradeCompositionVM.toViewModel(gradeComposition),
      ),
    });
  }

  @Post()
  @ApiOperation({
    summary: 'Creates grade composition',
  })
  @ApiCreatedResponse({ description: 'grade composition created.' })
  @ApiBadRequestResponse({
    description: 'The request object doesn`t match the expected one',
    type: BadRequestError,
  })
  @ApiUnprocessableEntityResponse({
    description: 'Validation error while creating grade composition',
    type: UnprocessableEntityError,
  })
  @ApiBody({ type: [UpsertGradeCompositionVM] })
  @UseGuards(TeacherRoleGuard)
  async createGradeComposition(
    @Headers('class-id') currentClassId: number,
    @Body(new ParseArrayPipe({ items: UpsertGradeCompositionVM }))
    createGrandeCompositionVM: UpsertGradeCompositionVM[],
  ) {
    await this.gradeCompositionUseCase.addGradeComposition(
      createGrandeCompositionVM.map((vm) =>
        UpsertGradeCompositionVM.fromViewModel(vm).forClass(currentClassId),
      ),
    );

    return new SuccessResponseDTO({
      message: 'Grade composition created',
      metadata: {},
    });
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Updates grade composition',
  })
  @UseGuards(TeacherRoleGuard)
  async updateGradeComposition(
    @Headers('class-id') currentClassId: number,
    @Param('id', ParseIntPipe) gradeCompositionId: number,
    @Body() gradeComposition: UpsertGradeCompositionVM,
  ) {
    await this.gradeCompositionUseCase.updateGradeComposition(
      gradeCompositionId,
      UpsertGradeCompositionVM.fromViewModel(gradeComposition),
      currentClassId,
    );

    return new SuccessResponseDTO({
      message: 'Grade composition updated',
      metadata: {},
    });
  }

  @Patch('/arrange')
  @ApiOperation({
    summary: 'Arranges grade composition',
  })
  @ApiBody({ type: [Number] })
  @UseGuards(TeacherRoleGuard)
  async arrangeGradeComposition(
    @Headers('class-id') currentClassId: number,
    @Body(new ParseArrayPipe({ items: Number })) gradeCompositionIds: number[],
  ) {
    await this.gradeCompositionUseCase.arrangeGradeComposition(
      gradeCompositionIds,
      currentClassId,
    );

    return new SuccessResponseDTO({
      message: 'Grade composition arranged',
      metadata: {},
    });
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Deletes grade composition',
  })
  @UseGuards(TeacherRoleGuard)
  async deleteGradeComposition(
    @Headers('class-id') currentClassId: number,
    @Param('id', ParseIntPipe) gradeCompositionId: number,
  ) {
    await this.gradeCompositionUseCase.deleteGradeComposition(
      gradeCompositionId,
      currentClassId,
    );

    return new SuccessResponseDTO({
      message: 'Grade composition deleted',
      metadata: {},
    });
  }
}
